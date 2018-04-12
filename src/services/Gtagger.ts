import { Gtagger } from 'gtagger';

const trackingId = 'UA-116831829-1';

export function StartAnalytics() {
  if (!__DEV__) {
    return false;
  }
  Gtagger.initialize(trackingId);
}