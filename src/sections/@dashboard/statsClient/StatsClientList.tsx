import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Button,
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material';
// routes

// sections
import { MethodCode, ModelCode } from '../../../@types/Permission';
import { IStatsClient } from '../../../@types/statsClient';
import { useAuthContext } from '../../../auth/useAuthContext';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from '../../../components/table';
import { useLocales } from '../../../locales';
import { getKpis } from '../../../redux/slices/kpis/actions';
import {
  deleteManyStatsClient,
  deleteStatsClient,
  getAllStatsClient,
} from '../../../redux/slices/statsClient/action';
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { findPermission } from '../Permissions/utils';
import StatsClientRow from './StatsClientRow';
import StatsClientTableToolbar from './StatsClientToolbar';
import { RoleCode } from '../../../@types/User';
import { IStatus } from '../../../@types/status';
import LoadingTable from '../../../components/loadingTable/LoadingTable';

export default function StatsClientList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });
  const TABLE_HEAD = [
    { id: 'name', label: 'Forum name', align: 'left' },
    { id: 'question', label: 'Question', align: 'left' },
    { id: 'create', label: 'create', align: 'center' },
    { label: 'view', align: 'center' },
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState<IStatsClient[]>([]);
  const [filterName, setFilterName] = useState('');
  useEffect(() => {
    dispatch(getAllStatsClient({ page, limit: rowsPerPage, orderBy, order, filterName }));
  }, [dispatch, page, rowsPerPage, orderBy, order, filterName]);
  const { statsClients, status } = useSelector((state: RootState) => state?.statsClient);
  useEffect(() => {
    setTableData(statsClients?.docs);
  }, [statsClients]);
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const [openConfirm, setOpenConfirm] = useState(false);
  const isFiltered = filterName !== '';
  const isNotFound = (!tableData.length && !!filterName) || !tableData.length;
  const denseHeight = dense ? 52 : 72;
  const handleViewRow = (row: IStatsClient) => {
    navigate(`${PATH_DASHBOARD.statsClient.view}/${row._id}`, { state: { statsClient: row } });
  };
  const handleCreateRowResponse = (row: IStatsClient) => {
    navigate(`${PATH_DASHBOARD.statClientResponse.new}/${row._id}`, {
      state: { statsClient: row },
    });
  };

  const handleEditRow = (row: IStatsClient) => {
    navigate(`${PATH_DASHBOARD.statsClient.edit}/${row._id}`, { state: { statsClient: row } });
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  const handleOpenConfirm = (id?: string) => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleDeleteRow = async (id: string) => {
    await dispatch(deleteStatsClient({ id }))
      .unwrap()
      .then((res) => enqueueSnackbar(`${res.data.message}`))
      .catch((error) => enqueueSnackbar(`${error.data.message}`, { variant: 'error' }));
  };

  const handleDeleteRows = (selectedRows: string[]) => {
    dispatch(deleteManyStatsClient({ statClientIds: selectedRows }))
      .unwrap()
      .then((res) => {
        enqueueSnackbar(`${translate(res?.data.message)}`);
        dispatch(getKpis({ page: 0, limit: rowsPerPage, orderBy, order, search: filterName }));
      })
      .catch((err) => enqueueSnackbar(`${translate(err.message)}`, { variant: 'error' }));
    setSelected([]);
  };

  const { user } = useAuthContext();
  const isSuperAdmin = user?.role === RoleCode.SUPER_ADMIN;

  // check current user permissions
  const isAllowedToEditStatClient =
    isSuperAdmin ||
    findPermission(
      user?.permissionGroup,
      user?.extraPermissions,
      ModelCode.STAT_CLIENT,
      MethodCode.EDIT
    );

  const isAllowedToDeleteStatClient =
    isSuperAdmin ||
    findPermission(
      user?.permissionGroup,
      user?.extraPermissions,
      ModelCode.STAT_CLIENT,
      MethodCode.DELETE
    );

  if (isAllowedToDeleteStatClient && isAllowedToEditStatClient) {
    TABLE_HEAD.push({ label: 'edit', align: 'center' }, { label: 'delete', align: 'center' });
  }

  return (
    <>
      <Container maxWidth={false}>
        <Card>
          <StatsClientTableToolbar
            onResetFilter={handleResetFilter}
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            placeholder="Search by Stats Client Name..."
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData?.map((row) => row._id)
                )
              }
              action={
                <Tooltip title={`${translate('Delete')}`}>
                  <IconButton color="primary" onClick={() => handleOpenConfirm()}>
                    <Iconify icon="material-symbols:delete" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked: boolean) =>
                    onSelectAllRows(
                      checked,
                      tableData?.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {status === IStatus.LOADING ? (
                    <LoadingTable
                      height={denseHeight}
                      fields={TABLE_HEAD.length}
                      rowsPerPage={rowsPerPage}
                    />
                  ) : (
                    tableData?.map((row: IStatsClient) => (
                      <StatsClientRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => {
                          handleDeleteRow(row._id);
                        }}
                        onEditRow={() => {
                          handleEditRow(row);
                        }}
                        onViewRow={() => {
                          handleViewRow(row);
                        }}
                        onCreateRowResponse={() => {
                          handleCreateRowResponse(row);
                        }}
                      />
                    ))
                  )}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={statsClients.meta.totalDocs || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected?.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
