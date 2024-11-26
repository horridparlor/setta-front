import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LanguageSelect() {
  const { i18n } = useTranslation();

  const handleChange = async (e: SelectChangeEvent) => {
    await i18n.changeLanguage(e.target.value);
  };

  return (
    <Select
      data-testid="language-select"
      value={i18n.language}
      onChange={handleChange}
      sx={{ backgroundColor: 'white' }}
    >
      <MenuItem data-testid="language-option-fi" value="fi">
        Finnish
      </MenuItem>
      <MenuItem data-testid="language-option-en" value="en">
        English
      </MenuItem>
      <MenuItem value="ru">Russian</MenuItem>
      <MenuItem value="jp">Japanese</MenuItem>
    </Select>
  );
}
