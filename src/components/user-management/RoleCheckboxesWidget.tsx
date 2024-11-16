import Box from '@mui/material/Box';
import {
  AccessRightName,
  AccessRightsRequired,
  ADMIN_LEVEL_ACCESS_RIGHTS,
  COMMON_ACCESS_RIGHTS,
  isCommonAccessRight,
} from './CreateUser';
import { FormControlLabel, Checkbox, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export type RoleAccessRightsCheckboxesWidgetProps = {
  value: AccessRightsRequired;
  onChange: (value: AccessRightsRequired) => void;
};

export const RoleAccessRightsCheckboxesWidget: React.FC<
  RoleAccessRightsCheckboxesWidgetProps
> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const allCommonAccessRightsSelected = Object.entries(value).every(
    ([accessRightName, value]) => {
      return (
        Boolean(value) ||
        !isCommonAccessRight(accessRightName as AccessRightName)
      );
    }
  );

  const setAllCommonRights = useCallback(
    (selectAll: boolean) => {
      if (selectAll) {
        onChange({
          ...value,
          ...Object.fromEntries(
            (COMMON_ACCESS_RIGHTS as AccessRightName[]).map(accessRightName => [
              accessRightName,
              true,
            ])
          ),
        });
      } else {
        onChange({
          ...value,
          ...Object.fromEntries(
            (COMMON_ACCESS_RIGHTS as AccessRightName[]).map(accessRightName => [
              accessRightName,
              false,
            ])
          ),
        });
      }
    },
    [onChange, allCommonAccessRightsSelected, value]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          border: '1px solid red',
          borderRadius: '4px',
          paddingTop: '8px',
          paddingLeft: '8px',
          paddingBottom: '8px',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            backgroundColor: 'white',
            px: 1,
            zIndex: 1,
            top: 0,
            left: 20,
            transform: 'translateY(-50%)',
          }}
        >
          {t('ADMIN_LEVEL_ACCESS_RIGHTS')}
        </Typography>
        <FormControlLabel
          key={'SUPER_ADMIN_CHECKBOX'}
          control={<Checkbox checked={!!value.isSuperAdmin} disabled />}
          label="isSuperAdmin"
        />

        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
          }}
        >
          {ADMIN_LEVEL_ACCESS_RIGHTS.map(accessRightName => {
            return (
              <FormControlLabel
                key={accessRightName}
                control={
                  <Checkbox
                    checked={!!value[accessRightName]}
                    onChange={e => {
                      onChange({
                        ...value,
                        [accessRightName]: e.target.checked,
                      });
                    }}
                  />
                }
                label={t(accessRightName, { defaultValue: accessRightName })}
              />
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          position: 'relative',
          border: '1px solid blue',
          borderRadius: '4px',
          paddingTop: '8px',
          paddingLeft: '8px',
          paddingBottom: '8px',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            backgroundColor: 'white',
            px: 1,
            zIndex: 1,
            top: 0,
            left: 20,
            transform: 'translateY(-50%)',
          }}
        >
          {t('COMMON_ACCESS_RIGHTS')}
        </Typography>
        <FormControlLabel
          key={'selectAllCommon'}
          control={
            <Checkbox
              checked={!!allCommonAccessRightsSelected}
              onChange={e => setAllCommonRights(e.target.checked)}
            />
          }
          label={t('SELECT_ALL')}
        />
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
          }}
        >
          {COMMON_ACCESS_RIGHTS.map(accessRightName => {
            return (
              <FormControlLabel
                key={accessRightName}
                control={
                  <Checkbox
                    checked={!!value[accessRightName]}
                    onChange={e => {
                      onChange({
                        ...value,
                        [accessRightName]: e.target.checked,
                      });
                    }}
                  />
                }
                label={t(accessRightName, { defaultValue: accessRightName })}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
