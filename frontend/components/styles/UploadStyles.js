import styled from 'styled-components';
import { Upload } from 'antd';

export const UploadWrapper = styled(Upload)`
  .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 200px;
    height: 200px;
  }
  .ant-upload-list-item.ant-upload-list-item-uploading {
    width: 200px;
    height: 200px;
  }
  .ant-upload-list-item.ant-upload-list-item-done {
    width: 200px;
    height: 200px;
  }
  .ant-upload-list-item-uploading-text {
    text-align: center;
    padding-top: 69px;
  }
`;
