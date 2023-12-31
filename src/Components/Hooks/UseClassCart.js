import { useQuery } from '@tanstack/react-query'
import UseAuth from './UseAuth';
import UseAxiosSecure from './UseAxiosSecure';


const UseClassCart = () => {
    const { User, loading } = UseAuth();
    const [axiosSecure] = UseAxiosSecure();
    const token = localStorage.getItem('access_token');


    const { refetch, data: student = [] } = useQuery({
        queryKey: ['Student', User?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosSecure(`/Student?email=${User?.email}`, {
                headers: {
                    authorization: `Bearer${token}`,
                }
            })
            // console.log(res.data)
            return res.data;
        },
    })

    return [student, refetch];

}
export default UseClassCart;

