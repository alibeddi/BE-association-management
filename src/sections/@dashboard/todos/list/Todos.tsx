import { Card, Divider, Grid, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../../../@types/Todo';
import EmptyContent from '../../../../components/empty-content';
import { TableNoData, TablePaginationCustom, useTable } from '../../../../components/table';
import { getTodosAssignedToMe, getTodosCreatedbyMe } from '../../../../redux/slices/todos/actions';
import { dispatch, RootState, useSelector } from '../../../../redux/store';
import { AddNewTodo } from '../form';
import TodoList from './TodoList';
import TodosToolbar from './TodosToolbar';

const TODO_STATUS_OPTIONS = ['all', 'todo', 'completed'];
const TODO_FILTERS = ['Created By me', 'Assigned To me'];

export default function Todos() {
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

  const [filterTodos, setFilterTodos] = useState('Created By me');
  const { assignedTodos, myTodos } = useSelector((state: RootState) => state.todos);

  const [todos, setTodos] = useState<Todo[]>([]);

  const [filterDescription, setFilterDescription] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const isFiltered = filterDescription !== '' || filterStatus !== 'all';
  const isNotFound =
    (!todos.length && !!filterDescription) || (!todos.length && !!filterStatus) || !todos.length;
  // const dataInPage = todos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    if (filterTodos === 'Assigned To me') {
      dispatch(getTodosAssignedToMe({ page, limit: rowsPerPage, filterDescription, filterStatus }));
    } else {
      dispatch(getTodosCreatedbyMe({ page, limit: rowsPerPage, filterDescription, filterStatus }));
    }
  }, [page, rowsPerPage, filterDescription, filterStatus]);

  useEffect(() => {
    setTodos(filterTodos === 'Created By me' ? myTodos.docs : assignedTodos?.docs);
  }, [assignedTodos, myTodos, filterTodos]);

  const handleChangeTabs = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setPage(0);
    setFilterTodos(newValue);
    if (newValue === 'created By me') {
      dispatch(getTodosCreatedbyMe({ page: 1 }));
    } else {
      dispatch(getTodosAssignedToMe({ page: 0 }));
    }
    handleResetFilter();
  };
  const handleResetFilter = () => {
    setFilterDescription('');
    setFilterStatus('all');
  };
  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleFilterDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterDescription(event.target.value);
  };

  return (
    <>
      <Card sx={{ marginTop: 4 }}>
        <Tabs
          value={filterTodos}
          onChange={handleChangeTabs}
          sx={{
            px: 2,
            bgcolor: 'background.neutral',
          }}
        >
          {TODO_FILTERS.map((tab) => (
            <Tab key={tab} label={tab} value={tab} />
          ))}
        </Tabs>

        <Divider />

        {filterTodos === 'Created By me' && <AddNewTodo />}

        <TodosToolbar
          placeholder="search by text..."
          isFiltered={isFiltered}
          filterDescription={filterDescription}
          filterStatus={filterStatus}
          optionsStatus={TODO_STATUS_OPTIONS}
          onFilterDescription={handleFilterDescription}
          onFilterStatus={handleFilterStatus}
          onResetFilter={handleResetFilter}
        />
        <Grid item xs={12} md={6} lg={8}>
          <TodoList title="Tasks" list={todos} />
          {isNotFound && (
            <EmptyContent
              title="No Data"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          )}
          <TablePaginationCustom
            count={myTodos.meta.totalDocs || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Grid>
      </Card>
    </>
  );
}
