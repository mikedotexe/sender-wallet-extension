import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
    },
  },
  typography: {
    fontFamily: 'Inter, Lato, "Lucida Grande", Tahoma, sans-serif !important',
    button: {
      textTransform: 'none'
    }
  },
})

export default theme;
