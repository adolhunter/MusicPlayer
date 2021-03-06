import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";
import RabbitLyrics from "rabbit-lyrics";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Toast from "react-bootstrap/Toast";

export default class RabbitPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.mediaRef = React.createRef();
    this.textRef = React.createRef();
    this.prevLyrics = this.props.lyrics;
    this.prevMusic = this.props.music;
    this.state = { showToast: false };
    this.toggleToast = this.toggleToast.bind(this);
    this.toggleFalse = this.toggleFalse.bind(this);
  }

  toggleToast() {
    this.setState({ showToast: true });
  }

  toggleFalse() {
    this.setState({ showToast: false });
  }

  render() {
    return (
      <>
        <Container>
          <Row>
            <Col xs="12">
              {" "}
              <div
                data-media="lyrics-1"
                data-height="700"
                data-alignment="center"
                ref={this.textRef}
              >
                {this.props.lyrics}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <AudioPlayer
                autoPlay
                src={this.props.music}
                ref={this.mediaRef}
                customAdditionalControls={[
                  RHAP_UI.LOOP,
                  // eslint-disable-next-line react/jsx-key
                  <i
                    className="fas fa-chevron-circle-up"
                    onClick={() => {
                      this.toggleToast();
                      this.props.speedUp();
                    }}
                  ></i>,
                  // eslint-disable-next-line react/jsx-key
                  <i
                    className="fas fa-chevron-circle-down"
                    onClick={() => {
                      this.toggleToast();
                      this.props.speedDown();
                    }}
                  ></i>,
                ]}
              />
            </Col>
          </Row>
        </Container>

        <Toast
          onClose={this.toggleFalse}
          show={this.state.showToast}
          delay={3000}
          autohide
          style={{
            position: "absolute",
            top: 500,
            right:150,
          }}
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Laxis, Inc</strong>
            <small>Just Now</small>
          </Toast.Header>
          <Toast.Body>
            You changed playback speed to {this.props.speed}
          </Toast.Body>
        </Toast>
      </>
    );
  }

  async componentDidUpdate() {
    if (
      this.prevMusic === this.props.music &&
      this.prevLyrics === this.props.lyrics
    ) {
      this.mediaRef.current.audio.current.playbackRate = this.props.speed;
      return;
    }

    if (this.prevMusic !== this.props.music) {
      const audio = this.mediaRef.current.audio.current;
      try {
        await audio.pause();
        await audio.load();
        await audio.play();
      } catch (e) {
        console.log("The user interrupted the playback");
      }
      new RabbitLyrics({
        element: this.textRef.current,
        mediaElement: this.mediaRef.current.audio.current,
        height: 700,
      });
      this.prevMusic = this.props.music;
    }

    if (this.prevLyrics === this.props.lyrics) {
      return;
    }
    this.textRef.current.classList.remove("rabbit-lyrics");
    this.textRef.current.classList.remove("rabbit-lyrics--default");
    this.textRef.current.classList.remove("rabbit-lyrics--enabled");
    this.textRef.current.classList.remove("rabbit-lyrics--playing");
    new RabbitLyrics({
      element: this.textRef.current,
      mediaElement: this.mediaRef.current.audio.current,
      height: 700,
    });
    this.prevLyrics = this.props.lyrics;
  }

  componentDidMount() {
    new RabbitLyrics({
      element: this.textRef.current,
      mediaElement: this.mediaRef.current.audio.current,
      height: 700,
    });
  }
}

RabbitPlayer.propTypes = {
  music: PropTypes.string,
  lyrics: PropTypes.string,
  speed: PropTypes.number,
  speedDown: PropTypes.func,
  speedUp: PropTypes.func,
};
