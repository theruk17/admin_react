import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
import axios from 'axios';
const props = {
  name: 'file',
  multiple: true,
  action: 'https://drab-jade-haddock-toga.cyclic.app/upload_case',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      const formData = new FormData();
      formData.append('file', info.file.originFileObj);
      axios.post('https://drab-jade-haddock-toga.cyclic.app/upload_case', formData)
        .then(res => console.log(res.data))
        .catch(err => console.error(err));
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};
const Upload_data = () => (
  <div className='h-80'>
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </Dragger>
  </div>
);
export default Upload_data;