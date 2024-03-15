export const useDate = ({ settings }: { settings: { rfts_app_date_format: string } }) => {
  const { rfts_app_date_format } = settings;

  const dateFormat = rfts_app_date_format;

  return {
    dateFormat,
  };
};
