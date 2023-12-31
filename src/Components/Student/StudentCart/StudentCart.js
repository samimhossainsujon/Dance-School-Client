import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import { MdAutoDelete, MdOutlinePayment } from 'react-icons/md';
import Swal from 'sweetalert2';
import UseAuth from '../../Hooks/UseAuth';
import { Link } from 'react-router-dom';

const StudentCart = () => {
    const [axiosSecure] = UseAxiosSecure();
    const [students, setStudent] = useState([]);
    const [total, setTotal] = useState(0);
    const { User } = UseAuth();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axiosSecure.get(`/student/${User.email}`)
            .then((response) => {
                const studentData = response.data;
                setStudent(studentData);
                // console.log(studentData);
                const totalAmount = studentData.reduce((sum, item) => item.Price + sum, 0);
                setTotal(totalAmount);
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle error if necessary
            });
    };

    const handelCardRemove = student => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
            .then(result => {
                if (result.isConfirmed) {
                    fetch(`https://assignment-12-server-tawny.vercel.app/CartStudent/${student._id}`, {
                        method: 'DELETE'
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.deletedCount > 0) {
                                fetchStudents();
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Your work has been saved',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            }
                        })
                        .catch(error => {
                            console.error('Error deleting user:', error);
                            Swal.fire('Error',
                                'Failed to delete user.',
                                'error');
                        });
                }
            });
    };



    return (
        <div className='w-full p-5'>

            <div className='uppercase flex justify-between px-10'>
                <h1 className='text-3xl'>Total Cart: {students.length}</h1>
                <h1 className='text-3xl'>total price: ${total}</h1>
                <Link>
                    {/* to='/DashBoard/payment' */}
                    <button
                        className="btn btn-outline btn-secondary">
                        Pay
                    </button>
                </Link>
            </div>
            <div className="divider"></div>

            <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr className='text-lg text-black'>
                                <th>#</th>
                                <th>Class Photo</th>
                                <th>Class Name</th>
                                <th>Instructor Name</th>
                                <th>Price</th>
                                <th>Delete</th>
                                <th>Pay</th>
                            </tr>
                        </thead>
                        <tbody>

                            {students.map((student, index) =>
                                <tr
                                    key={student._id}
                                    student={student}
                                >
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                    <img src={student.ClassImage} alt='' />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{student.ClassName}</td>
                                    <td>{student.InstructorName}</td>
                                    <td>{student.Price}</td>
                                    <th>
                                        <button
                                            onClick={() => handelCardRemove(student)}
                                            className="btn btn-outline btn-secondary">
                                            <MdAutoDelete />
                                        </button>
                                    </th>
                                    <th>
                                        <Link to={`/DashBoard/payment/${student._id}`}>
                                            <button
                                                className="btn btn-outline btn-secondary">
                                                <MdOutlinePayment />
                                            </button>
                                        </Link>
                                    </th>
                                </tr>)}



                        </tbody>


                    </table>
                </div>
            </div>
        </div>
    );
}

export default StudentCart;