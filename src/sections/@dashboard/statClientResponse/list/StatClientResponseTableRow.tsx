import {
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { MethodCode, ModelCode } from '../../../../@types/Permission';
import { StatClientResponse } from '../../../../@types/StatClientResponse';
import { useAuthContext } from '../../../../auth/useAuthContext';
import ConfirmDialog from '../../../../components/confirm-dialog';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import { fDate } from '../../../../utils/formatTime';
import { hasPermission } from '../../Permissions/utils';
import RenderTableCell from './utils/renderTableCellContent';

type Props = {
  row: StatClientResponse;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function StatClientResponseTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
}: Props) {

  const { admin, clientName, clientContact, statClient, createdAt, kpis } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const { user } = useAuthContext();
  const userPermissions = user?.permissionGroup[0].permissions;

  // check current user permissions
  const isAllowedToDeleteKpi = hasPermission(userPermissions, ModelCode.KPI, MethodCode.DELETE);
  const isAllowedToEditKpi = hasPermission(userPermissions, ModelCode.KPI, MethodCode.EDIT);
  const isAllowedToViewKpi = hasPermission(userPermissions, ModelCode.KPI, MethodCode.VIEW);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {admin.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {clientName}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {clientContact}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {statClient?.name}
          </Typography>
        </TableCell>

        {kpis.map((kpi) => RenderTableCell(kpi))}

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {fDate(createdAt)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {isAllowedToDeleteKpi && (
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        )}
        {isAllowedToEditKpi && (
          <MenuItem
            onClick={() => {
              onEditRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
        )}
        {isAllowedToViewKpi && (
          <MenuItem
            onClick={() => {
              onViewRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="carbon:view-filled" />
            View
          </MenuItem>
        )}
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
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
