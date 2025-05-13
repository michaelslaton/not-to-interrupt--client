import '../roomsDisplay.css';

type FormInputProps = {
  name: string;
  handleChange: Function;
  handleSubmit: Function;
  type: string;
}

const FormInput = ({ name, handleChange, handleSubmit, type }: FormInputProps) => {

  return (
    <div className='rooms-display__create-container'>
      <input
        type='text'
        className='rooms-display__create-input'
        placeholder={`${type} Name`}
        value={name}
        onChange={(e)=> handleChange(e, type)}
      />
      <button
        className='rooms-display__create'
        onClick={()=> handleSubmit(type)}
      >
        Create {type}
      </button>
    </div>
  );
};

export default FormInput;