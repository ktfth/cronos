'use strict';

function give(p, f) {
  if (p === 'minute' && f === undefined) return give() * 60;
  if (p === 'hour' && f === undefined) return give('minute') * 60;
  if ((p === undefined || p === 'second') && f === undefined) return 1000;
}
exports.give = give;

function timeLapse(display) {
  let d = display.split(':')
  let out = 0;
  const h = () => parseInt(d[0], 10);
  const m = () => parseInt(d[1], 10);
  const s = () => parseInt(d[2], 10);
  if (h() > 0) {
    out += give('hour') * h();
  }
  if (m() > 0) {
    out += give('minute') * m();
  }
  if (s() > 0) {
    out += give('second') * s();
  }
  return out;
};
exports.timeLapse = timeLapse;

function treatTime(display) {
  display = display.split(':').map(v => parseInt(v, 10));
  display = [
    display[0] < 10 && display[0] > 0 ? '0' + display[0] : display[0],
    display[1] < 10 && display[1] > 0 ? '0' + display[1] : display[1],
    display[2] < 10 && display[2] > 0 ? '0' + display[2] : display[2],
  ].join(':');
  return display;
}
exports.treatTime = treatTime;

function start(display) {
  let trigger = null;
  let tl = 0;

  function startCronosTrigger() {
    let releaseTheLastPhaseOfHour = false;
    let isHourUpdate = false;
    let releaseTheLastPhaseOfMinute = false;
    let isMinuteUpdate = false;
    let releaseTheLastPhaseOfSecond = false;
    let tl = timeLapse(display);
    display = treatTime(display);
    trigger = setInterval(() => {
      if (tl >= 0) {
        display =
          display
            .split(':')
            .map((v, i) => {
              if (i === 0) {
                let t = parseInt(v, 10);
                if (t > 0 && display[1] === '00') {
                  if (!releaseTheLastPhaseOfHour) {
                    t -= 1;
                    releaseTheLastPhaseOfHour = true;
                    isHourUpdate = true;
                  }
                  if (releaseTheLastPhaseOfMinute) {
                    t -= 1;
                    releaseTheLastPhaseOfMinute = false;
                    isHourUpdate = true;
                  }
                  if (!releaseTheLastPhaseOfHour && t === 0) {
                    releaseTheLastPhaseOfHour = true;
                  }
                }
                if (t === 0) {
                  t = '0';
                }
                v = t;
              }
              if (i === 1) {
                let t = parseInt(v, 10);
                if (t > 0 && display[2] === '00') {
                  if (releaseTheLastPhaseOfSecond) {
                    t -= 1;
                    releaseTheLastPhaseOfSecond = false;
                    isMinuteUpdate = true;
                  }
                  if (!releaseTheLastPhaseOfMinute && t === 0) {
                    releaseTheLastPhaseOfMinute = true;
                  }
                }
                if (t === 0) {
                  t = '00';
                }
                v = t < 10 && t > 0 ? '0' + t : t;
              }
              if (i === 2) {
                let t = parseInt(v, 10);
                if (t > 0) {
                  t -= 1;
                  if (!releaseTheLastPhaseOfSecond && t === 0) {
                    releaseTheLastPhaseOfSecond = true;
                  }
                }
                if (t === 0) {
                  releaseTheLastPhaseOfSecond = true;
                  t = '00';
                }
                v = t < 10 && t > 0 ? '0' + t : t;
              }
              return v;
            })
            .join(':');

        if (releaseTheLastPhaseOfHour) {
          let d = display.split(':');
          d[1] = '59';
          d[2] = '59';
          display = d.join(':');
          releaseTheLastPhaseOfHour = false;
        }

        if (isHourUpdate) {
          let d = display.split(':');
          let hours = parseInt(d[0], 10);
          if (hours > 0) {
            d[1] = '59';
            display = d.join(':');
            isHourUpdate = false;
          }
        }

        if (releaseTheLastPhaseOfMinute) {
          let d = display.split(':');
          d[2] = '59';
          display = d.join(':');
          releaseTheLastPhaseOfMinute = false;
        }

        if (isMinuteUpdate) {
          let d = display.split(':');
          let minutes = parseInt(d[1], 10);
          if (minutes > 0) {
            d[2] = '59';
            display = d.join(':');
            isMinuteUpdate = false;
          }
        }
      } else {
        clearInterval(trigger);
      }
      tl -= 1000;
    }, 1000);
    return trigger;
  }

  return startCronosTrigger();
}

exports.start = start;
