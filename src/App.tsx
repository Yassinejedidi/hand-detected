import { useRef, useState } from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import './App.css';
import { drawHand } from "./utils/utils.js";
import * as fp from "fingerpose";
import ThumbsDownGesture from "./fingerpose/ThumbsDown.js";
import MiddleFingerGesture from "./fingerpose/MiddleFinger.js";
import OKSignGesture from "./fingerpose/OKSign.js";
import PinchedFingerGesture from "./fingerpose/PinchedFinger.js";
import PinchedHandGesture from "./fingerpose/PinchedHand.js";
import RaisedHandGesture from "./fingerpose/RaisedHand.js";
import LoveYouGesture from "./fingerpose/LoveYou.js";
import RockOnGesture from "./fingerpose/RockOn.js";
import CallMeGesture from "./fingerpose/CallMe.js";
import PointUpGesture from "./fingerpose/PointUp.js";
import PointDownGesture from "./fingerpose/PointDown.js";
import PointRightGesture from "./fingerpose/PointRight.js";
import PointLeftGesture from "./fingerpose/PointLeft.js";
import RaisedFistGesture from "./fingerpose/RaisedFist.js";
import victory from "./img/victory.png";
import thumbs_up from "./img/thumbs_up.png";
import thumbs_down from "./img/thumbs_down.png";
import middle_finger from "./img/middle_finger.png";
import ok_sign from "./img/ok_sign.png";
import pinched_finger from "./img/pinched_finger.png";
import pinched_hand from "./img/pinched_hand.png";
import raised_hand from "./img/raised_hand.png";
import love_you from "./img/love_you.png";
import rock_on from "./img/rock_on.png";
import call_me from "./img/call_me.png";
import point_up from "./img/point_up.png";
import point_down from "./img/point_down.png";
import point_left from "./img/point_left.png";
import point_right from "./img/point_right.png";
import raised_fist from "./img/raised_fist.png";

const App: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [emoji, setEmoji] = useState<string | null>(null);
  const images: Record<string, string> = {
    thumbs_up,
    victory,
    thumbs_down,
    middle_finger,
    ok_sign,
    pinched_finger,
    pinched_hand,
    raised_hand,
    love_you,
    rock_on,
    call_me,
    point_up,
    point_down,
    point_left,
    point_right,
    raised_fist,
  };

  const runHandpose = async () => {
    const net = await handpose.load();
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net: handpose.HandPose) => {
    if (webcamRef && webcamRef.current &&  webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      if (canvasRef.current) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const hand:any = await net.estimateHands(video);

        if (hand.length > 0) {
          const GE = new fp.GestureEstimator([
            fp.Gestures.VictoryGesture,
            fp.Gestures.ThumbsUpGesture,
            ThumbsDownGesture,
            MiddleFingerGesture,
            OKSignGesture,
            PinchedFingerGesture,
            PinchedHandGesture,
            RaisedHandGesture,
            LoveYouGesture,
            RockOnGesture,
            CallMeGesture,
            PointRightGesture,
            PointUpGesture,
            PointLeftGesture,
            PointDownGesture,
            RaisedFistGesture,
          ]);
          const gesture = await GE.estimate(hand[0].landmarks, 8);
          if (gesture.gestures && gesture.gestures.length > 0) {
            const confidence = gesture.gestures.map(
              (prediction) => prediction.score
            );
            const maxConfidence = confidence.indexOf(
              Math.max(...confidence)
            );
            setEmoji(gesture.gestures[maxConfidence].name);
          }
        }

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          drawHand(hand, ctx);
        }
      }
    }
  };

  runHandpose();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }} />
        <canvas ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }} />

        {emoji !== null ? (
          <img
            src={images[emoji]}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 400,
              bottom: 500,
              right: 0,
              textAlign: "center",
              height: 100,
            }}
          />
        ) : (
          ""
        )}
      </header>
    </div>
  );
}

export default App;
