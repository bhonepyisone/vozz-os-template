import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import FsBackend from 'i18next-fs-backend';
import { fallbackLng, languages } from './i18n-config';
import path from 'path';

const i18nServer = i18n.createInstance();
i18nServer
  .use(FsBackend)
  .use(initReactI18next)
  .init({
    lng: fallbackLng,
    fallbackLng,
    supportedLngs: languages,
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: path.join(process.cwd(), 'public/locales/{{lng}}/{{ns}}.json'),
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18nServer;
