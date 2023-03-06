import React from "react";
import { Text, View, StyleSheet, Image, Modal ,TouchableWithoutFeedback} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
// import BorderedCancelButton from "./BorderedCancelButton";
import /GreenButton from "./GreenButton";
import WhiteButton from "./WhiteButton";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "7%",
   

  },
  box: {
    // width: 335,
    // height: 392,
    // flex: 0.5,
    alignSelf: "stretch",
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 50,
    shadowOpacity: 1,
    paddingRight: "5%",
    paddingLeft: "5%",
    paddingVertical :"10%",
    
  },

  transactionStatus: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "left",
    color: "#222222",
  },

  message: {
    fontSize: 16,
  fontWeight: "500",
  fontStyle: "normal",
  lineHeight: 24,
  letterSpacing: 0,
  textAlign: "center",
  color: "#707070"
  },

  IconWrapper: {
    marginBottom: 15,
    alignSelf:'center',
    alignItems:'center'
  },
  descriptionWrapper: {
    marginBottom: 5,
    // marginTop: 10,
  },

  statusMessageWrapper: {
    width: 254,
    marginBottom: 15,
  },
  closeBox: {
    top: 0,
    alignSelf: "flex-end",
    marginRight: 5,
    marginTop: 10,
  },
});

export default function ConfirmationComponent({
  closModal,
  visible,
  children,
  message,
  response,
  iconName,
  iconColor, 
  imageIcon
}) {
 
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closModal}
    >
      <View style={styles.container}>

      <TouchableWithoutFeedback onPress={closModal}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

        <View style={styles.box}>

          {/* <View style={styles.closeBox}>
            <BorderedCancelButton onPress={closModal} />
          </View> */}

          <View style={styles.IconWrapper}>
             {imageIcon ?  <Image source={imageIcon}/> :  <Icon name= {iconName ?? "information-circle"} size={100} color={ iconColor ?? "#17375e"} />}
          </View>

          

          <View style={styles.descriptionWrapper}>
            <Text style={styles.message}>{message}</Text>
          </View>

          <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:20}}>
            <WhiteButton  bordered
            text="No, Cancel"
             onPress= {() => response(false)}
            />
            <GreenButton

            text = "Yes, Proceed"
            onPress= {() => response(true)}
            />
          </View>


        </View>
        
        <TouchableWithoutFeedback onPress={closModal}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}
