import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { editTodo, closeModal } from "../../../session/actions";
import { connect } from "react-redux";
import { util, generateBase64FromImage } from '../../../helpers/helper';
import { todoService } from '../../../services/todo.service';
import { host } from '../../../helpers/constants';


const TodoUpdateModal = ({ editTodo, ...props }) => {
    const {
        className, todo
    } = props;

    var checkam = todo.status;
    var titre = todo.title;
    var assigned = todo.assigned_to ? todo.assigned_to._id : "";
    var file;
    const [newImg, setNewImg] = useState("");

    return (
        <div>
            <Modal isOpen={props.modalOpen === "TodoUpdateModal"} toggle={props.closeModal} className={className}>
                <ModalHeader toggle={props.close}>Edit Todo</ModalHeader>
                <Form onSubmit={e => {
                    e.preventDefault()
                    editTodo({
                        title: titre, status: checkam,
                        _id: todo._id, assigned_to: assigned
                    })
                    props.closeModal()
                }}>
                    <ModalBody>

                        <FormGroup>
                            <Label for="exampleText">Text Area</Label>
                            <Input type="textarea" onChange={e => {
                                titre = e.target.value
                            }} defaultValue={titre} name="text" id="exampleText" />
                        </FormGroup>


                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" onChange={() => checkam = !checkam} defaultChecked={checkam} />
                                Mark as done
                                </Label>
                        </FormGroup>
                        <br />
                        <FormGroup >
                            <Label> Assign this todo to:  </Label>
                            <select defaultValue={assigned}
                                onChange={e => {
                                    assigned = e.target.value;
                                }} className="form-control">
                                <option value="">Nobody</option>
                                {props.users.map((user, key) => {
                                    return <option value={user._id} key={key}>{user.name}</option>
                                })}
                            </select>
                        </FormGroup>
                        {todo.images && todo.images.map((img, key) => {
                            return <img key={key} src={host + '/' + img} alt="" className="todo-imgs" />
                        })}
                        {newImg && <img src={newImg} alt="" className="todo-imgs" />}
                        <input type="file" name="image" onChange={e => {
                            const formData = new FormData();
                            formData.append('image', e.target.files[0])
                            formData.append('_id', todo._id)
                            todoService.addImage(formData).then(res => {
                                console.log(res.data);
                            })
                            generateBase64FromImage(e.target.files[0]).then(b64 => {
                                setNewImg(b64)
                            })
                        }}
                            className="hidden" accept="image/png,image/jpeg" ref={x => file = x}></input>

                        <div className="text-center">
                            <Button className="btn btn-primary"
                                onClick={() => {
                                    file.click()
                                }}>Add Pictures</Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit">Save Changes</Button>{' '}
                        <Button color="secondary" onClick={props.closeModal}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </div>
    );
}

export default connect(util.mapStateToProps("todo", "modalOpen"), { editTodo, closeModal })(TodoUpdateModal);
