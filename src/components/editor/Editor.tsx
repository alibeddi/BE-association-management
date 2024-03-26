import '../../utils/highlight';
import ReactQuill from 'react-quill';
import 'quill-mention';
//
import { EditorProps } from './types';
import { StyledEditor } from './styles';
import EditorToolbar, { formats } from './EditorToolbar';
import { dispatch } from '../../redux/store';
import { getOfficesAndUsers } from '../../redux/slices/todos/actions';
import { Office } from '../../@types/offices';
import { User } from '../../@types/User';
import { isUser } from '../../sections/@dashboard/todos/utils/isUser';

// ----------------------------------------------------------------------
const atValues = [
  { id: 1, value: 'Fredrik Sundqvist' },
  { id: 2, value: 'Patrik Sjölin' },
];
const hashValues = [
  { id: 3, value: 'Fredrik Sundqvist 2' },
  { id: 4, value: 'Patrik Sjölin 2' },
];
const mentionModule = {
  allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
  mentionDenotationChars: ['@'],
  source(searchTerm: string, renderList: (arg0: any) => void) {
    dispatch(getOfficesAndUsers({ page: 1, limit: 10, search: searchTerm }))
      .unwrap()
      .then((res) => {
        const data = res.data;
        const docs = [...data.offices, ...data.users];
        renderList(
          docs.map((doc: User | Office) => ({
            id: doc._id,
            value: isUser(doc) ? doc.username || doc.email : doc.name,
          }))
        );
      })
      .catch((err) => console.log(err));
    renderList(atValues);
  },
};

export default function Editor({
  id = 'minimal-quill',
  error,
  value,
  onChange,
  simple = false,
  helperText,
  sx,
  ...other
}: EditorProps) {
  const modules = {
    mention: mentionModule,
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };
  
  return (
    <>
      <StyledEditor
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
        }}
      >
        <EditorToolbar id={id} isSimple={simple} />

        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write something awesome..."
          {...other}
        />
      </StyledEditor>

      {helperText && helperText}
    </>
  );
}
