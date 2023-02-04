import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axiosClient from "../axios-client"
import { useStateContext } from "../contexts/ContextProvider"

export default function Signup() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const {setNotification} = useStateContext()

    useEffect(() => {
        getUsers()
    }, [])

    const onDelete = user => {
        if(!window.confirm('Are yu sure you want to delete this user?')) {
            return
        }

        setLoading(true)
        axiosClient.delete(`/users/${user.id}`)
        .then(() => {
            // TODO show notification
            setNotification('User was successfullly deleted')
            getUsers()
        })
    }

    const getUsers = () => {
        axiosClient.get('/users')
        .then(({data}) => {
            setLoading(false)
            setUsers(data.data)
        })
        .catch(() => {
            setLoading(false)
        })
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add new</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {
                        loading &&
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading ...
                                </td>
                            </tr>
                        </tbody>
                    }
                    {
                        !loading &&
                        <tbody>
                            {
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.created_at}</td>
                                        <td>
                                            <Link className="btn-edit" to={'/users/' + user.id}>Edit</Link>
                                            &nbsp;
                                            <button className="btn-delete" onClick={() => onDelete(user)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    }
                </table>
            </div>
        </div>
    )
}
