import colors from 'colors';

interface Logger {
  (...messages: any[]): void;
}

const LEVEL_COLORS = {
  info: colors.green,
  debug: colors.blue,
  success: colors.green,
  warning: colors.yellow,
  danger: colors.red,
  error: colors.red,
  critical: colors.magenta
} as const;

const getTimestamp = () => {
  const date = new Date();

  const yyyy = date.getFullYear();
  const MM = date.getMonth().toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');

  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  const aaa = date.getMilliseconds().toString().padStart(3, '0');

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}.${aaa}`;
};

const printLog = (level: keyof typeof LEVEL_COLORS, ...messages: any[]) => {
  console.log(
    `[${getTimestamp()}]`.gray,
    `${LEVEL_COLORS[level](level.toUpperCase())}`,
    '-',
    ...messages
  );
};

export const logger: Record<keyof typeof LEVEL_COLORS, Logger> = {
  info: (...messages) => printLog('info', ...messages),
  debug: (...messages) => printLog('debug', ...messages),
  success: (...messages) => printLog('success', ...messages),
  warning: (...messages) => printLog('warning', ...messages),
  danger: (...messages) => printLog('danger', ...messages),
  error: (...messages) => printLog('error', ...messages),
  critical: (...messages) => printLog('critical', ...messages),
};
