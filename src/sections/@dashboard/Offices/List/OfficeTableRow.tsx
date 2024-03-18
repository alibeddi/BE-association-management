// @mui
import { Box, TableCell, TableRow, Typography } from '@mui/material';
import { Office } from '../../../../@types/offices';
// utils
import { fDate } from '../../../../utils/formatTime';
// components

type Props = {
  row: Office;
};

export default function OfficeTableRow({ row }: Props) {
  const { name, address, createdAt } = row;

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Box
            sx={{
              maxWidth: 125,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {address}
          </Box>
        </TableCell>
        <TableCell align="left">{fDate(createdAt)}</TableCell>
      </TableRow>
    </>
  );
}
