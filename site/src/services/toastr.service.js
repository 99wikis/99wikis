import { publish } from '../infrastructure/pubSub';

const dispatchToastr = (status, title, description) => {
  publish('showToastr', { status, title, description });
}

const success = (description, title = 'Cool.') => dispatchToastr('success', title, description);

const error = (description, title = 'Oops') => dispatchToastr('error', title, description);

const warning = (description, title = 'Hmmm') => dispatchToastr('warning', title, description);

const info = (description, title = 'Hey!') => dispatchToastr('info', title, description);

export default {
  success,
  error,
  warning,
  info,
}