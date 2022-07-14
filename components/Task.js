import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native'

import Icon from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Task = (props, {getParentTask}) => {

    const [done, setDone] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [taskData, setTaskData] = useState([])
    const [mapIndex, setMapIndex] = useState()

    // HANDLES DONE TO DOS
    const handleDone = () => {
        console.log(done)
        setDone(!done)
    }
    // GETTING TO DOS
    const getTasks = () => {
        AsyncStorage.getItem('storedTasks')
        .then(res => {
            console.log(res)
            if(res){
                setTaskData(JSON.parse(res))
            }
        })
    }
    // DELETES TO DOS
    const handleDeleteTask = () => {
        const deleteTask = [...taskData]
        deleteTask.splice(mapIndex, 1)
        AsyncStorage.setItem("storedTasks", JSON.stringify(deleteTask))
        .then(() => {
            setTaskData(deleteTask)
            props.getParentTask()
            setModalVisible(false)
            Alert.alert("Notice", "Task successfully deleted")
        })
        .catch(err => {
            console.log(err)
        })
    }
    // OPEN DELETE MODAL
    const openDeleteModal = (index) => {
        getTasks()
        setModalVisible(true)
        setMapIndex(index)
        console.log(index)
    }

    return (
        <>
            <View style={styles.tasks}>
                <View style={styles.tasksWrapper}>
                    <TouchableOpacity onPress={()=> handleDone()} style={done == false ? styles.square : styles.squareDone}></TouchableOpacity>
                    <Text style={done == false ? styles.taskItems : styles.taskItemsDone}>{props.text}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={()=> openDeleteModal(props.deleteIndex)}>
                        <Icon name="trash" size={20} color='red' />
                    </TouchableOpacity>
                </View>

                {/** DELETE MODAL */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    setModalVisible(false);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalHeader}>Are you sure you want to delete this list ("{props.text}")?</Text>
                            <View style={styles.modalBtnWrapper}>
                            <TouchableOpacity
                            style={styles.btnModal}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalTextStyle}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={styles.btnCancel}
                            onPress={()=> handleDeleteTask()}
                            >
                            <Text style={styles.modalTextStyle}>Delete</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    tasks:{
        backgroundColor:"#FFF",
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        marginTop: 20,
    },
    tasksWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    square:{
        width: 24,
        height: 24,
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 5,
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
    },
    squareDone:{
        width: 24,
        height: 24,
        borderColor: 'blue',
        backgroundColor:'blue',
        borderWidth: 2,
        borderRadius: 5,
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
    },
    taskItems:{
        color: 'black',
        maxWidth: '80%',
        fontWeight: 'bold',
    },
    taskItemsDone:{
        color: 'darkgray',
        maxWidth: '80%',
        fontWeight: 'bold',
        textDecorationLine: 'line-through'
    },
    
    //STYLES FOR MODAL
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 60,
        paddingBottom: 50,
        paddingLeft: 50, 
        paddingRight: 50,
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    modalHeader: {
        marginBottom: 15,
        marginTop: -40,
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
        fontWeight:'bold',
    },
    modalInput: {
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: 'lightblue',
        borderWidth: 1,
        width: 250,
        color: 'black',
        marginBottom: 15, 
    },
    btnModal:{
        backgroundColor:'#69a8f5',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 60,
        marginRight: 20
    },
    modalBtnWrapper:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },
    btnCancel:{
        backgroundColor:'red',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 60,
    },
    modalTextStyle:{
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
    },
});

export default Task;