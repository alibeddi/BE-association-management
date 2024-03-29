import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { RootState, dispatch, useSelector } from '../../redux/store';
import { getOnekpi } from '../../redux/slices/kpis/actions';
import { KpiForm } from '../../sections/@dashboard/Kpis/form';
// sections

// ----------------------------------------------------------------------

export default function KpiEditPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    id && dispatch(getOnekpi({ kpiId: id }));
  }, [id]);
  const { kpi } = useSelector((state: RootState) => state.kpis);
  return (
    <>
      <Helmet>
        <title> Kpi: Edit </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Edit a Kpi"
          links={[
            {
              name: 'Kpi',
              href: PATH_DASHBOARD.kpis.root,
            },
            { name: 'Edit Kpi' },
          ]}
        />
        <KpiForm isEdit currentKpi={kpi} />
      </Container>
    </>
  );
}
