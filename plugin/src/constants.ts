declare const process: any;
const isMock = process.env.MOCK === true || process.env.MOCK === 'true';
export const BASE_URL = isMock ? "http://localhost:8080" : "https://barcross.ru";

export const BC_FORUM_DOMAIN = "barcross.ru";
export const BC_FORUM_FANDOM_ID = 9;
export const BC_FORUM_ALT_ID = 10;
export const BC_FORUM_COMPLETED_ID = 11;
