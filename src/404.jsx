import { useRouteError, Link } from "react-router-dom";
import { Button, Result } from 'antd';
export default function ErrorPage404() {
    const error = useRouteError();

    return (
        <Result
            style={{ backgroundColor: '#fff', minHeight: '100vh' }}
            status="404"
            title="404"
            subTitle={error.statusText || error.message}
            extra={<Button type="primary"><Link to={"/"}>Back Home</Link></Button>}
        />

    );
}