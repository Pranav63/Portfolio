import CountUp from '@/components/reactbits/CountUp';

// Counts up a single figure such as "63", "34.7%", "$0.04" or "~950ms".
// Values with more than one number ("60 / 60") or none are shown as written.
const SINGLE = /^([~$]?)(\d+(?:\.\d+)?)([^\d]*)$/;

export default function Stat({ value }) {
  const match = SINGLE.exec(value);
  if (!match) return value;
  const [, prefix, number, suffix] = match;
  const decimals = number.includes('.') ? number.split('.')[1].length : 0;
  return <CountUp to={Number(number)} prefix={prefix} suffix={suffix} decimals={decimals} duration={1.6} />;
}
