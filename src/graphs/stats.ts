import { ProgressLogsInfo } from "../tables/progress_logs";

const MILLISECONDS_PER_DAY : number = 1000 * 60 * 60 * 24;

export function get_slope_of_logs(logs : ProgressLogsInfo[]) : number {

  if (!logs || logs.length === 0) {
    return 0;
  }

  let n : number = logs.length;
  const first_log : ProgressLogsInfo | undefined = logs[0];
  const last_log : ProgressLogsInfo | undefined = logs[n - 1];

  if (!first_log || !first_log.start_page || !first_log.timestamp || !last_log || !last_log.end_page || !last_log.timestamp) {
    console.log("Issue getting first and last logs info when calcualting the slops.");
    return 0;
  }

  let total_pages_read : number = last_log.end_page - first_log.start_page;
  const date1 : Date = new Date(first_log.timestamp);
  const date2 : Date = new Date(last_log.timestamp);
 
  console.log(date1);
  console.log(date2);
 
  // get diff in days using the diff in miliseconds 
  const diff_in_days = Math.max(1, (Math.abs(date2.getTime() - date1.getTime()) / MILLISECONDS_PER_DAY));

  return (total_pages_read / diff_in_days);
}