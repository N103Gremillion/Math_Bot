import * as asciichart from "asciichart";
import { BookInfo } from "../tables/books";
import { ProgressLogsInfo } from "../tables/progress_logs";
import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { get_authors_str } from "../utils/util";

const MAX_GRAPH_HEIGHT : number = 20;
const MAX_CHARS_PER_LINE : number = 100;

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
  WHITE : asciichart.white
};


export async function get_book_progress_chart(user_name : string, book: BookInfo, logs : ProgressLogsInfo[]): Promise<string> {

  if (!logs || logs.length === 0 || !book.number_of_pages) {
    return "No progress logs available for this book.";
  }

  const firstDate = new Date(logs[0]!.timestamp!);
  const lastDate = new Date(logs[logs.length - 1]!.timestamp!);
  const totalDays =
    Math.floor(
      (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const dailyProgress = Array(totalDays).fill(0);

  for (const log of logs) {
    const dayIndex = Math.floor(
      (new Date(log!.timestamp!).getTime() - firstDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const pagesRead = log!.end_page! - log!.start_page!;
    if (dayIndex >= 0 && dayIndex < totalDays) {
      dailyProgress[dayIndex] += pagesRead;
    }
  }

  const cumulativeProgress: number[] = [];
  dailyProgress.reduce((acc, curr, i) => {
    const total = acc + curr;
    cumulativeProgress[i] = total;
    return total;
  }, 0);

  // Projected progress line (linear growth)
  const projectedProgress: number[] = [];
  for (let i = 0; i < totalDays; i++) {
    projectedProgress.push(
      Math.floor(((i + 1) * book.number_of_pages) / totalDays)
    );
  }

  const chart = asciichart.plot(
    [cumulativeProgress, projectedProgress],
    {
      height: MAX_GRAPH_HEIGHT,
      colors: [LINE_COLORS.MAGENTA, LINE_COLORS.YELLOW],
      min: 0,
      max: book.number_of_pages,
    }
  );

  let res = "```ansi\n" + chart + "\n";

  // Add day index labels below chart
  const xAxisLabels = cumulativeProgress
    .map((_, i) => (i % 5 === 0 ? String(i).padStart(3, ' ') : '   '))
    .join('');
  res += xAxisLabels + "\n";

  // Legend
  res += `\x1b[35m●\x1b[0m Actual Progress\n`;
  res += `\x1b[33m●\x1b[0m Projected Progress`;
  res += "\n```";

  return res;
}

