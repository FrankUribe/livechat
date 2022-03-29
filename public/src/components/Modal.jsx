export default function Modal (props){
  return (
    <div className={`modal ${props.show ? 'active' : ''}`}>
        {props.children}
    </div>
  )
}
export function ModalHeader (props){
  return (
    <div className='modal-header'>
        {props.children}
    </div>
  )
}
export function ModalBody (props){
  return (
    <div className='modal-body'>
        {props.children}
    </div>
  )
}
export function ModalFooter (props){
  return (
    <div className='modal-footer'>
        {props.children}
    </div>
  )
}

