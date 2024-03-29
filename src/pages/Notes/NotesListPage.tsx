import { Button, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { RoleCode } from '../../@types/User';
import { useAuthContext } from '../../auth/useAuthContext';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';
import { useSettingsContext } from '../../components/settings';
import { useLocales } from '../../locales';
import { PATH_DASHBOARD } from '../../routes/paths';
import { NotesList } from '../../sections/@dashboard/Notes/list';

export default function NotesListPage() {
  const { translate } = useLocales();
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const isSuperAdmin = user?.role === RoleCode.SUPER_ADMIN;
  return (
    <>
      <Helmet>
        <title>{`${translate('Notes')}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Notes"
          links={[{ name: 'Notes' }]}
          action={
            isSuperAdmin && (
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.notes.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Note
              </Button>
            )
          }
        />
        <NotesList />
      </Container>
    </>
  );
}
