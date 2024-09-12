import '../App.css';
import EventCompo from '../components/EventCompo';
import Header from "../components/header"
import { motion } from 'framer-motion';

function Event() {
  return (
   
    <div>
    <Header />
    {/* <motion.div
    initial={{ y: '-100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    transition={{ duration : 1}}
   
  > */}
    <EventCompo/>
    {/* </motion.div> */}
    </div>
   
  );
}

export default Event;