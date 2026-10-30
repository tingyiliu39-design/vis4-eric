# Part 2: Library Claim, 10-Position Rotary BCD Switch

**Part:** SUNGMUN Electronics MSSR-10 (seller listing: MSSR-10(LG)), 10-position rotary coded switch, 0-9, real BCD code
**Proposed library folder:** `1_Arduino/Rotary_switch_BCD`
**Used in my project for:** the selector on the sewing machine slider prototype

## Datasheet / product pages
- Datasheet (7.4 x 7.4 mm family, TME): https://www.tme.eu/Document/6898c1070a3fb508a40ae2c54b8c0649/7.4x7.4-DTE.pdf
- Product page, through-hole MSSR-10 (JLCPCB C440476): https://jlcpcb.com/partdetail/SUNGMUN-MSSR10/C440476
- Product page, SMD variant MSSR-10S (TME): https://www.tme.eu/en/details/mssr-10s/encoding-switches/sungmun-electronics/

## Key specs
| | |
|---|---|
| Positions | 10 (0-9), real BCD code |
| Body | 7.4 x 7.4 mm, 3.65 mm tall, 4.5 mm knurled spindle (slot for a screwdriver) |
| Rating | 100 mA @ 42 V DC switching; 400 mA @ 42 V DC non-switching |
| Contact resistance | 80 mOhm max |
| Life | 25,000 steps |
| Mounting | Through-hole, 6 pins, 2.54 mm pitch, rows 7.62 mm apart (fits across a breadboard's centre gap like a DIP chip) |

**Voltage for this class:** it only carries signal current, so 5 V from the Arduino is well within rating.

## Pins (top view, position 0 toward the flat edge)
```
  1 o     o 8
  C o     o C
  4 o     o 2
```
- **C** (x2): common, internally connected
- **1, 2, 4, 8**: code outputs; each one connects to C when its bit is on

## Truth table (standard real BCD; to confirm with the continuity tester in Week 7)
| Position | 1 | 2 | 4 | 8 |
|---|---|---|---|---|
| 0 | | | | |
| 1 | x | | | |
| 2 | | x | | |
| 3 | x | x | | |
| 4 | | | x | |
| 5 | x | | x | |
| 6 | | x | x | |
| 7 | x | x | x | |
| 8 | | | | x |
| 9 | x | | | x |

## Plan
- **Week 7:** C to GND; pins 1/2/4/8 to D2-D5 with `INPUT_PULLUP` (no resistors needed). A pin reads LOW when its bit is on: position = 1·(D2 LOW) + 2·(D3 LOW) + 4·(D4 LOW) + 8·(D5 LOW). Print it to the Serial Monitor.
- **Week 8:** Solder onto a solderable breadboard. In Fritzing, use the core part "Hexadecimal Rotary Encoder" (APEM PT65-303, same 1/2/4/8/C/C pins) as the closest generic part, with a note. Then add `.fzz`, `.jpg`, `.ino` and `README.md` per CONTRIBUTE.md.
