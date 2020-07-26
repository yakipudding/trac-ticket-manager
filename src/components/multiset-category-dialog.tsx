import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface DialogProps {
  open: boolean,
  multiCategory: any,
  onClose: {
    bivarianceHack(event: {}, reason: 'backdropClick' | 'escapeKeyDown'): void;
  }['bivarianceHack'],
  onChange: any,
  onOkClick:  (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  onCancelClick:  (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

const MultiSetCategoryDialog = (props: DialogProps) => {
  
  return(
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">カテゴリ一括セット</DialogTitle>
      <DialogContent>
        <DialogContentText>
          一括セットするカテゴリを入力してください
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="category"
          label="カテゴリ"
          value={props.multiCategory}
          onChange={props.onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onOkClick} color="primary">
          OK
        </Button>
        <Button onClick={props.onCancelClick} color="primary">
          キャンセル
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default MultiSetCategoryDialog