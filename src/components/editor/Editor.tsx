import '../../utils/highlight';
import ReactQuill from 'react-quill';
import 'quill-mention';
//
import { EditorProps } from './types';
import { StyledEditor } from './styles';
import EditorToolbar, { formats } from './EditorToolbar';

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
  mentionDenotationChars: ['@', '#'],
  source(
    searchTerm: string,
    renderList: (arg0: { id: number; value: string }[], arg1: any) => void,
    mentionChar: string
  ) {
    console.log(renderList, mentionChar);
    let values;

    if (mentionChar === '@') {
      values = atValues;
    } else {
      values = hashValues;
    }

    if (searchTerm.length === 0) {
      renderList(values, searchTerm);
    } else {
      const matches = [];
      for (let i = 0; i < values.length; i += 1) {
        if (values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
          matches.push(values[i]);
        }
      }

      renderList(matches, searchTerm);
    }
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
