import useGroupCountdown from './useGroupCountdown';
import useCountdown from '@/app/[room]/timer/components/useCountdown';

export default function useSessionCountdown({
  sec,
 
}: {
  sec: number;
 
}) {

const groupCountDown = useGroupCountdown({endTime:endTime || Date.now(),sec});
const personalCountDown = useCountdown({sec})


if (isGroup) {
    return {
      ...groupCountDown,
      onPause: () => {},
      onReset: () => {},
    };
  } else {
    return personalCountDown;
  }
  
}
