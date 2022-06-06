import * as _ from 'lodash';

import { PlayerRecord } from '../models';

export function computeTransfer(records: PlayerRecord[]): string[] {
  console.log(records);
  console.log(records[0]?.balance)
  _.map(records, (r: PlayerRecord) => {
    console.log(`${r.player_name}: ${r.balance}, ${typeof r.balance}`);
    return ""
  })
  let winners = records
    .filter((r) => r.balance > 0)
    .sort((a, b) => (a.balance as number) - (b.balance as number));
  let losers = records
    .filter((r) => r.balance < 0)
    .map((r) => Object.assign(r, { balance: (r.balance as number) * -1 }))
    .sort((a, b) => a.balance - b.balance);

  const totalWin = winners.reduce((acc, item) => {
    return acc + (item.balance as number);
  }, 0);
  const totalLose = losers.reduce((acc, item) => {
    return acc + (item.balance as number);
  }, 0);

  // console.log(winners);
  // console.log(losers);

  let result: string[] = [];

  // console.log(`win: ${totalWin}, lose: ${totalLose}`);

  if (totalWin > totalLose) {
    console.log(`diff: ${totalWin - totalLose}`);
    winners[winners.length - 1].balance =
      (winners[winners.length - 1].balance as number) - (totalWin - totalLose);
  }

  // console.log(winners);
  // console.log(losers);

  while (winners.length > 0 && losers.length > 0) {
    let w = winners[winners.length - 1];
    let l = losers[losers.length - 1];
    if (!l) {
      console.log(l);
    }
    if (!w) {
      console.log(w);
    }
    if (w.balance === l.balance) {
      result.push(`${l.player_name} to ${w.player_name}, $${l.balance / 100}`);
      losers.pop();
      winners.pop();
    } else if (w.balance > l.balance) {
      winners[winners.length - 1].balance = w.balance - l.balance;
      result.push(`${l.player_name} to ${w.player_name}, $${l.balance / 100}`);
      losers.pop();
    } else {
      losers[losers.length - 1].balance = l.balance - w.balance;
      result.push(`${l.player_name} to ${w.player_name}, $${(w.balance as number)/ 100}`);
      winners.pop();
    }
  }
  return result;
}