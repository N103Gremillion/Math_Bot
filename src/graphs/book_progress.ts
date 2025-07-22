import * as asciichart from "asciichart";
import { BookInfo } from "../tables/books";
import { ProgressLogsInfo } from "../tables/progress_logs";
import { differenceInCalendarDays, max, startOfDay } from 'date-fns';
import { get_authors_str } from "../utils/util";
import { get_slope_of_logs } from "./stats";

const MAX_GRAPH_HEIGHT : number = 15;
const MAX_POINTS_PER_GRAPH : number = 37;

export const LINE_COLORS = {
  BLACK: asciichart.black,
  RED: asciichart.red,
  GREEN: asciichart.green,
  YELLOW : asciichart.yellow,
  BLUE: asciichart.blue,
  MAGENTA : asciichart.magenta,
  CYAN : asciichart.cyan,
  LIGHT_GRAY : asciichart.lightgray,
  DEFAULT : asciichart.default,
  DARK_GRAY : asciichart.darkgray,
  LIGHT_RED : asciichart.lightred,
  LIGHT_GREEN : asciichart.lightgreen,
  LIGHT_YELLOW : asciichart.lightyellow,
  LIGHT_BLUE : asciichart.lightblue,
  LIGHT_MAGENTA : asciichart.lightmagenta,
  LIGHT_CYAN : asciichart.lightcyan,
  WHITE : asciichart.white,
  RESET : asciichart.reset
};


export async function get_book_progress_chart(user_name : string, book: BookInfo, logs : ProgressLogsInfo[]): Promise<string> {

  if (!logs || logs.length === 0 || !book.number_of_pages) {
    return "No progress logs available for this book.";
  }

  // construct the projected array
  const slope : number = get_slope_of_logs(logs);
  const total_pages : number = book.number_of_pages;
  const projected_num_of_days : number = total_pages / slope;


  const projected : number[] = get_projected_array(slope, projected_num_of_days, total_pages);
  const actual_progress : number[] = get_actual_progress_scaled(logs, logs[logs.length - 1]?.end_page!, book.number_of_pages);
  
  const projected_color : string = LINE_COLORS.BLUE; 
  const acutal_color : string = LINE_COLORS.RED;
  
  const config = {
    height : MAX_GRAPH_HEIGHT,
    colors : [projected_color, acutal_color],
    min : 0,
    max : total_pages
  }

  const chart = asciichart.plot(
    [projected, actual_progress],
    config
  );

  let res = "```ansi\n" + chart + "\n";

  // contruct the x_axis ###########################
  const total_labels : number = 5;
  let cur_time : number = 0;
  const step : number = projected_num_of_days / total_labels;
  const inital_gap : string  = "            ";
  const gap_between_labels : string = "    ";
  const gap_between_ticks : string = "       ";

  // row with or -
  res += `${inital_gap}`
  res += "-------------------------------------------\n";

  // row with | on it
  res += `${inital_gap}`
  for (let i = 0; i <= total_labels; i++) {
    res += `|${gap_between_ticks}`
  }
  res += "\n";

  // row with times on it
  res += `${inital_gap}`
  for (let i = 0; i <= total_labels; i++) {
    res += `${cur_time.toFixed(2)}${gap_between_labels}`;
    cur_time += step;
    cur_time = round_to_2_decimals(cur_time);
  }
  
  res += `\n`

  res += `${acutal_color}●${LINE_COLORS.RESET} Actual Progress`;
  res += `${projected_color}●${LINE_COLORS.RESET} Projected Progress`;
  res += "\n```";

  return res;
}

function get_projected_array(
  slope: number,  // pages/day
  x_max: number,  // total days
  y_max: number   // total pages
): number[] {
  const res: number[] = [];
  const x_gap: number = x_max / MAX_POINTS_PER_GRAPH;

  for (let i = 0; i <= MAX_POINTS_PER_GRAPH; i++) {
    const x = i * x_gap;
    let y = slope * x;

    if (y > y_max) y = y_max;

    res.push(y);
  }

  return res;
}

function get_actual_progress_scaled(
  logs: ProgressLogsInfo[],  
  cur_page : number, 
  max_page : number): number[] {

  const res : number[] = [0];
  const total_logs : number = logs.length;
  const percent_trough_book : number = (cur_page / max_page);
  const points_available : number = Math.floor(percent_trough_book * MAX_POINTS_PER_GRAPH);

  console.log(percent_trough_book);
  console.log(points_available);

  // we have to only select specific logs to prevent over use of points on graph and keep it scaled correclty
  if (total_logs >= points_available) {
    const step : number = total_logs / (points_available - 1);

    for (let i = 0; i < points_available; i++) {
      const index = Math.floor(i * step);
      const log = logs[index];
      if (!log || !log.end_page) continue;
      res.push(log.end_page);
    }
    // Always include the last log
    const last_page : number = logs[total_logs - 1]?.end_page!;
    res.push(last_page ?? res[res.length - 1]);
  } 
  // we have to pad the graph with points so it scales correctly
  else {
    const first_log_time = new Date(logs[0]!.timestamp!).getTime();
    const last_log_time = new Date(logs[logs.length - 1]!.timestamp!).getTime();
    const total_time_range = last_log_time - first_log_time;

    const time_between_points = total_time_range / (points_available - 1);

    let cur_log_index = 0;

    for (let point_index = 0; point_index < points_available; point_index++) {
      const currentTargetTime = first_log_time + point_index * time_between_points;

      // Move currentLogIndex forward while the next log is still before the target time
      while (
        cur_log_index < logs.length - 1 &&
        new Date(logs[cur_log_index + 1]!.timestamp!).getTime() <= currentTargetTime
      ) {
        cur_log_index++;
      }

      const currentLog = logs[cur_log_index];
      const currentPage = currentLog?.end_page ?? (res.length > 0 ? res[res.length - 1] : 0);

      res.push(currentPage!);
    }
  }
  return res;
}

function round_to_2_decimals(num: number): number {
  return Math.round(num * 100) / 100;
}
