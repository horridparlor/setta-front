import { useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeBar, { HomeBarRef } from '../../components/common/HomeBar';
import { useTranslation } from 'react-i18next';

interface ProcessManagementPageProps {
  refetch: () => Promise<void>;
}

const ProcessManagementPage = (props: ProcessManagementPageProps) => {
  const { refetch } = props;
  const { t } = useTranslation();
  const homeBarRef = useRef<HomeBarRef>(null);
  const [tabId, setTabId] = useState<number>(0);
  const [penName, setPenName] = useState('');
  const [userName, setUserName] = useState('');
  const [deck, setDeck] = useState('');
  const [expansion, setExpansion] = useState('');
  const [generatedSince, setGeneratedSince] = useState('');
  const [state, setState] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newTabId: number) => {
    setTabId(newTabId);
  };

  const handlePenNameChange = (e: SelectChangeEvent) => {
    setPenName(e.target.value);
  };

  const handleUserNameChange = (e: SelectChangeEvent) => {
    setUserName(e.target.value);
  };

  const handleDeckChange = (e: SelectChangeEvent) => {
    setDeck(e.target.value);
  };

  const handleExpansionChange = (e: SelectChangeEvent) => {
    setExpansion(e.target.value);
  };

  const handleGeneratedSinceChange = (e: SelectChangeEvent) => {
    setGeneratedSince(e.target.value);
  };

  const handleStateChange = (e: SelectChangeEvent) => {
    setState(e.target.value);
  };

  const tabColors = ['#14AE5C', '#E5A000', '#EC221F', '#5A5A5A'];
  // mock data
  const cardCounts = [12, 30, 3, 18];
  const tabLabels = [
    t('IMAGES_GENERATED'),
    t('IMAGES_IN_QUEUE'),
    t('IMAGES_FAILED'),
    t('PROMPT_MISSING_OR_INCOMPLETE'),
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#244775',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <HomeBar refetch={refetch} ref={homeBarRef} />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          overflow: 'auto',
          p: 2,
        }}
      >
        <Card sx={{ width: '90%' }}>
          <CardContent>
            <Tabs
              value={tabId}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="inherit"
              TabIndicatorProps={{
                style: { backgroundColor: tabColors[tabId] },
              }}
            >
              {tabColors.map((color, index) => (
                <Tab
                  key={index}
                  label={
                    <Box>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: '500',
                          color: color,
                          textAlign: 'center',
                        }}
                      >
                        {cardCounts[index]}
                      </Typography>
                      <Typography sx={{ color: color }}>
                        {tabLabels[index]}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </Tabs>

            {(tabId === 0 || tabId === 1 || tabId === 2) && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  m: 4,
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="created-by-label">
                    {t('CREATED_BY')}
                  </InputLabel>
                  <Select
                    labelId="created-by-label"
                    value={penName}
                    label={t('CREATED_BY')}
                    onChange={handlePenNameChange}
                  >
                    <MenuItem value="Penname">Pen name</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{t('GENERATED_BY')}</InputLabel>
                  <Select
                    value={userName}
                    label={t('GENERATED_BY')}
                    onChange={handleUserNameChange}
                  >
                    <MenuItem value="Username">Username</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{t('DECK')}</InputLabel>
                  <Select
                    value={deck}
                    label={t('DECK')}
                    onChange={handleDeckChange}
                  >
                    <MenuItem>-</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{t('EXPANSION')}</InputLabel>
                  <Select
                    value={expansion}
                    label={t('EXPANSION')}
                    onChange={handleExpansionChange}
                  >
                    <MenuItem>-</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{t('GENERATED_SINCE')}</InputLabel>
                  <Select
                    value={generatedSince}
                    label={t('GENERATED_SINCE')}
                    onChange={handleGeneratedSinceChange}
                  >
                    <MenuItem value="Showall">{t('SHOW_ALL')}</MenuItem>
                    <MenuItem value="Last24hours">
                      {t('LAST_24_HOURS')}
                    </MenuItem>
                    <MenuItem value="Last7days">{t('LAST_7_DAYS')}</MenuItem>
                    <MenuItem value="Last30days">{t('LAST_30_DAYS')}</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={t('SELECT_ALL')}
                    sx={{ whiteSpace: 'nowrap' }}
                  />
                  <IconButton>
                    <SettingsIcon />
                  </IconButton>
                </Box>
              </Box>
            )}

            {tabId === 3 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  m: 4,
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="created-by-label">
                    {t('CREATED_BY')}
                  </InputLabel>
                  <Select
                    labelId="created-by-label"
                    value={penName}
                    label={t('CREATED_BY')}
                    onChange={handlePenNameChange}
                  >
                    <MenuItem value="Penname">Pen name</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{t('DECK')}</InputLabel>
                  <Select
                    value={deck}
                    label={t('DECK')}
                    onChange={handleDeckChange}
                  >
                    <MenuItem>-</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{t('EXPANSION')}</InputLabel>
                  <Select
                    value={expansion}
                    label={t('EXPANSION')}
                    onChange={handleExpansionChange}
                  >
                    <MenuItem>-</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{t('STATE')}</InputLabel>
                  <Select
                    value={state}
                    label={t('STATE')}
                    onChange={handleStateChange}
                  >
                    <MenuItem value="Showall">{t('SHOW_ALL')}</MenuItem>
                    <MenuItem value="Promptincomplete">
                      {t('PROMPT_INCOMPLETE')}
                    </MenuItem>
                    <MenuItem value="Promptmissing">
                      {t('PROMPT_MISSING')}
                    </MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={t('SELECT_ALL')}
                    sx={{ whiteSpace: 'nowrap' }}
                  />
                  <IconButton>
                    <SettingsIcon />
                  </IconButton>
                </Box>
              </Box>
            )}

            {tabId === 0 && (
              <Box m={2}>
                <p>Cards with images generated</p>
              </Box>
            )}
            {tabId === 1 && (
              <Box m={2}>
                <p>Cards with images in queue</p>
              </Box>
            )}
            {tabId === 2 && (
              <Box m={2}>
                <p>Cards with failed images</p>
              </Box>
            )}
            {tabId === 3 && (
              <Box m={2}>
                <p>Cards with missing or imcomplete prompt</p>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ProcessManagementPage;
