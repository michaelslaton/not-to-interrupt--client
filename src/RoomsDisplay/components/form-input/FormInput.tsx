import './formInput.css';

type FormInputProps = {
  name: string;
  handleChange: Function;
  handleSubmit: Function;
  type: string;
}

const FormInput = ({ name, handleChange, handleSubmit, type }: FormInputProps) => {

  return (
    <div className='form-input__create-container'>
      <form onSubmit={(e)=> handleSubmit(e)}>
        <input
          type='text'
          className='form-input__create-input'
          placeholder={`${type} Name`}
          value={name}
          onChange={(e)=> handleChange(e, type)}
        />
        <button
          className='form-input__create'
          // onClick={()=> handleSubmit(type)}
          type='submit'
        >
          Create {type}
        </button>
      </form>
    </div>
  );
};

export default FormInput;