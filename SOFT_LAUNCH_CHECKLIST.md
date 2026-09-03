# Lucky Penny Craps — Soft Launch Checklist

## Core table regression
- [ ] Random dice roll correctly.
- [ ] Come-out 7 / 11 / craps resolve Pass and Don't Pass correctly.
- [ ] Point establishes and puck moves ON.
- [ ] Point made and seven-out behave correctly.
- [ ] Pass / Don't Pass odds resolve correctly.
- [ ] Come / Don't Come travel correctly.
- [ ] Traveled Come / Don't Come flat bets work on come-out rolls.
- [ ] Place bets pay correctly and stay up on wins.
- [ ] Place Working and global BETS ON/OFF controls behave correctly.
- [ ] Field, Hardways, Horn, C&E, World, Hop bets resolve correctly.
- [ ] Quick Bets place expected wager amounts.
- [ ] Add / Remove toggle works.
- [ ] Reset / Clear / Rebet / Undo work as expected.

## Sticky console
- [ ] Roll Dice is always accessible.
- [ ] Dice and total update.
- [ ] Roll Net P/L updates correctly.
- [ ] Chip selection works.
- [ ] Bankroll and On Table remain accurate.
- [ ] Strategy Next Bet clears when strategy picker opens.
- [ ] Center Bets drawer works on phone.

## Analytics
- [ ] Roll History records each roll and net P/L.
- [ ] Distribution updates for All / Puck On / Puck Off.
- [ ] Shooter only ends on a puck-ON 7.
- [ ] Come-out 7 does not start a new shooter.
- [ ] Shooter Total equals the sum of that shooter's roll nets.
- [ ] Session Hands retain completed shooter results.

## Practice / Strategy
- [ ] Practice Mode forced totals work.
- [ ] Exact dice combinations work.
- [ ] Puck selection works.
- [ ] Scenario presets work.
- [ ] All Strategy Mode choices load.
- [ ] Strategy guidance advances correctly.
- [ ] Table highlight matches the suggested next wager.

## Responsive
- [ ] Desktop at 100% zoom.
- [ ] iPad Mini / tablet.
- [ ] iPhone landscape.
- [ ] iPhone portrait shows rotate guidance.
- [ ] Sticky bar never blocks essential betting areas permanently.

## Soft-launch content
- [ ] Home page explains Practice • Play • Learn.
- [ ] How to Play page works.
- [ ] Strategies page works.
- [ ] About page works.
- [ ] All navigation links work.
- [ ] Practice-credit / no-cash-value language is visible.

## Before sharing publicly
- [ ] `bash test-rules.sh` passes all automated tests.
- [ ] `npm run dev` shows no build errors.
- [ ] VS Code Problems count is 0.
- [ ] `git status` is clean after commit/push.
- [ ] Test the deployed Vercel URL, not only Codespaces.
- [ ] Confirm luckypennycraps.com points to the intended deployment.
