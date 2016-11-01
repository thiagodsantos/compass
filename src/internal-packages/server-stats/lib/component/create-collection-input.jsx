const React = require('react');

class CreateCollectionInput extends React.Component {

  /**
   * Render the input.
   *
   * @returns {React.Component} The react component.
   */
  render() {
    return (
      <div className="form-group">
        <p>{this.props.name}</p>
        <input
          type="text"
          className="form-control"
          onChange={this.props.onChangeHandler}
          value={this.props.value} />
      </div>
    );
  }
}

CreateCollectionInput.displayName = 'CreateCollectionInput';

CreateCollectionInput.propTypes = {
  onChangeHandler: React.PropTypes.func.isRequired,
  value: React.PropTypes.string,
  name: React.PropTypes.string.isRequired
};

module.exports = CreateCollectionInput;