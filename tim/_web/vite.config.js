import path from 'path';

export default {
  base: '/art/tim/',
  build: {
    rollupOptions: {
      input: {
        '0001': path.resolve(__dirname, '0001-vicompany.html'),
        '0002': path.resolve(__dirname, '0002-waving-field.html'),
      },
    },
  },
};
