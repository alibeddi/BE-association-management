import { Button, IconButton, MenuItem, Stack } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { PermissionGroup } from 'src/@types/PermissionGroup';
import ConfirmDialog from 'src/components/confirm-dialog';
import Iconify from 'src/components/iconify';
import MenuPopover from 'src/components/menu-popover';
import { useLocales } from 'src/locales';
import { deleteGroupPermissionById, getPermissionGroup } from 'src/redux/slices/groupPermissions';
import { dispatch, RootState, useSelector } from 'src/redux/store';
import { PATH_DASHBOARD } from 'src/routes/paths';

type Props = {
  group: PermissionGroup;
  defaultValues: { group: string };
  isEdit: Boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  selectedItem?: string;
  setSelectedItem: Dispatch<SetStateAction<string>>;
};

const GroupButton = ({
  group,
  defaultValues,
  isEdit,
  setIsEdit,
  selectedItem,
  setSelectedItem,
}: Props) => {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { reset } = useFormContext();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const { permissionGroup } = useSelector((state: RootState) => state.permissions_groups);

  // TODO: Refactorooooo
  const deleteGroupPermission = group.permissions.find(
    (permission) => permission.model === 'PERMISSION_GROUP' && permission.method === 'DELETE'
  );
  const editGroupPermission = group.permissions.find(
    (permission) => permission.model === 'PERMISSION_GROUP' && permission.method === 'EDIT'
  );

  const isRowMenu = deleteGroupPermission || editGroupPermission;

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
  useEffect(() => {
    if (isEdit && permissionGroup) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, permissionGroup]);
  return (
    <>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          p: 1,
        }}
      >
        <Button
          sx={{
            px: 1,
            height: 48,
            width: '100%',
            textTransform: 'capitalize',
          }}
          variant={selectedItem === group._id ? 'contained' : undefined}
          color={selectedItem === group._id ? 'success' : undefined}
          onClick={() => {
            dispatch(getPermissionGroup({ id: group?._id }));
            setSelectedItem(group._id);
            navigate({
              pathname: PATH_DASHBOARD.groupPermissions,
              search: `?${createSearchParams({
                group: group._id,
              })}`,
            });
          }}
        >
          <>{group.name}</>
        </Button>
        {isRowMenu && (
          <IconButton
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            color={openPopover ? 'inherit' : 'default'}
            onClick={handleOpenPopover}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        )}
      </Stack>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {editGroupPermission && (
          <MenuItem
            onClick={() => {
              setIsEdit(true);
              dispatch(getPermissionGroup({ id: group?._id }));
              setSelectedItem(group._id);
              navigate({
                pathname: PATH_DASHBOARD.groupPermissions,
                search: `?${createSearchParams({
                  group: group._id.toString(),
                })}`,
              });
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            {`${translate('Edit')}`}
          </MenuItem>
        )}
        {deleteGroupPermission && (
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            {`${translate('Delete')}`}
          </MenuItem>
        )}
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={`${translate('Are you sure want to delete')}?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleCloseConfirm();
              dispatch(deleteGroupPermissionById({ id: group?._id }));
            }}
          >
            {`${translate('Delete')}`}
          </Button>
        }
      />
    </>
  );
};

export default GroupButton;
