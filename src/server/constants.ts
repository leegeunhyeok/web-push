import config from 'config';

export const DATA_PATH = 'data.json';

export const GCM_KEY = config.get<string>('gcmKey');
export const SUBJECT = config.get<string>('subject');
export const VAPID_PUBLIC = config.get<string>('vapid.public');
export const VAPID_PRIVATE = config.get<string>('vapid.private');
