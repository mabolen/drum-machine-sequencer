const SeqRow = ({ addClass }) => {
    //number of sequencer buttons
    const seqArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    
    //map seq buttons to DOM
    const seqMap = seqArray.map((num) => {
                return <div className={`seq-btn col-${num}`} key={num} onClick={(e)=>addClass(e.target)}></div>
            })

    return (
      <div className='seq-row'>
          {seqMap}
      </div>
    )
}

const RowOption = ({ updateRow, labelName, optionMap }) => {

    return (
        <div className='option'>
            <label>{labelName}</label>
            <select className='select text-glow' onChange={(e)=> {updateRow(e.target.value)}}>
                <option></option>
                {optionMap}
            </select>
        </div>
    )
}

const App = () => {

    const [displayText, setDisplayText] = React.useState('')
    const [timerIsActive, setTimerIsActive] = React.useState(false)
    const [bpm, setBpm] = React.useState(100)
    const [row1, setRow1] = React.useState('kick')
    const [row2, setRow2] = React.useState('snare')
    const [row3, setRow3] = React.useState('closed-hat')
    const [row4, setRow4] = React.useState('open-hat')

    //handle key trigger for pad sound
    React.useEffect(() => {
        document.addEventListener('keydown', (event) => {
            switch(event.key){
                case 'q' :
                    playAudio('kick')
                    break
                case 'w' :
                    playAudio('snare')
                    break
                case 'e' :
                    playAudio('clap')
                    break
                case 'a' :
                    playAudio('closed-hat')
                    break
                case 's' :
                    playAudio('open-hat')
                    break
                case 'd' :
                    playAudio('cymbal')
                    break
                case 'z' :
                    playAudio('floor-tom')
                    break
                case 'x' :
                    playAudio('mid-tom')
                    break
                case 'c' :
                    playAudio('high-tom')
                    break
            }
        })
    }, [])

    //handle sequencer audio clip play
    const playStep = (num) => {
        const seqStep = document.getElementsByClassName(`col-${num}`)
        const seqLight = document.getElementById(`seq-${num}`)
        if (seqStep[0].classList.contains('seq-btn-active')) {
            playClip(row1)
        }
        if (seqStep[1].classList.contains('seq-btn-active')) {
            playClip(row2)
        }
        if (seqStep[2].classList.contains('seq-btn-active')) {
            playClip(row3)
        }
        if (seqStep[3].classList.contains('seq-btn-active')) {
            playClip(row4)
        }
        seqLight.classList.add('seq-btn-active')
        setTimeout(()=> {
            seqLight.classList.remove('seq-btn-active')
        }, 1000 / bps)
    }

    //variables for transport/timer
    let bps = (bpm / 60) * 2
    let counter = 1
    let intervalId

    React.useEffect(() => {
        if (timerIsActive) {
            intervalId = setInterval(()=> {
                playStep(counter)
                if (counter < 16){
                    counter++
                } else {
                    counter = 1
                }
            }, 1000 / bps)
        } 
        return function clear() {
            clearInterval(intervalId)
        }
        
    }, [timerIsActive])
    
    //makes seq button active/inactive on click and changes color
    /***
     * @param {Element} e
     */
     const addClass = (e) => {
        e.classList.contains('seq-btn-active') ? e.classList.remove('seq-btn-active') : e.classList.add('seq-btn-active')
    }

    //handle play button click
    const timer = (e) => {
        counter = 1
        timerIsActive ? setTimerIsActive(false) : setTimerIsActive(true)
        addClass(e.target)
    }

    //functions to play audio clips
    const playClip = (sound) => {
        const audio = document.getElementById(sound)
        audio.currentTime = 0
        audio.play()
    }

    const playAudio = (sound) => {
        const audio = document.getElementById(sound)
        audio.currentTime = 0
        audio.play()
        const fadeEffect = (id) => {
            $(id).css('background-color', '#ff4444')
            setTimeout(() => {
                $(id).css('background-color', '#f18973')
            }, 50)
        }
        setDisplayText(sound)   
        fadeEffect(`.${sound}`)
    }

    //urls to sound clips
    const sounds = {
        kick: 'https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Kicks/120[kb]basic-ekick.wav.mp3',
        snare: 'https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Snares/33[kb]909sd.wav.mp3',
        clap: 'https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Claps/13[kb]707-clap.wav.mp3',
        closedHat: 'https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Hats/15[kb]chh.wav.mp3',
        openHat: 'https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Hats/43[kb]707-ohh.wav.mp3',
        cymbal: 'https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Cymbals/82[kb]opencym.wav.mp3',
        floorTom: 'https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Toms/44[kb]lotom.wav.mp3',
        midTom: 'https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Toms/42[kb]midtom.wav.mp3',
        highTom: 'https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Toms/39[kb]hitom.wav.mp3'
    }

    //info for adding pads to dom
    const padLetters = [
        ['Q', 'kick', sounds.kick], 
        ['W', 'snare', sounds.snare], 
        ['E', 'clap', sounds.clap], 
        ['A', 'closed-hat', sounds.closedHat], 
        ['S', 'open-hat', sounds.openHat], 
        ['D', 'cymbal', sounds.cymbal], 
        ['Z', 'floor-tom', sounds.floorTom], 
        ['X', 'mid-tom', sounds.midTom], 
        ['C', 'high-tom', sounds.highTom]
    ]

    //allow user to change bpm
    const enterBpm = () => {
        const bpmInput = document.getElementById('bpm').value
        bpmInput <= 240 && bpmInput >= 40 ? setBpm(bpmInput) : alert('BPM must be between 40 and 240')
        $('#btn-bpm').css('background-color', '#ff4444')
            setTimeout(() => {
                $('#btn-bpm').css('background-color', '#f18973')
            }, 50)
    }

    //functions to set row sound state
    const updateRow1 = (value) => {
        setRow1(value)
    }
    const updateRow2 = (value) => {
        setRow2(value)
    }
    const updateRow3 = (value) => {
        setRow3(value)
    }
    const updateRow4 = (value) => {
        setRow4(value)
    }

    //map options to set row sounds
    const optionMap = padLetters.map((el)=> {
        return (
            <option key={`option-${el[1]}`} value={el[1]}>{el[1]}</option>
        )
    })

    //sequencer section
    const lightArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const lightMap = lightArray.map((el)=> {
        return (
            <div key={el} className='light-box'>
                <div id={`seq-${el}`} className='seq-light'></div>
            </div>
        )
    })
    //drum pad keys, can be clicked or played with key press
    const padKeys = padLetters.map( e => {
        return <div onClick={() => {playAudio(e[1])}} key={e[0]} className={`drum-pad ${e[1]}`} id={e[0]}>{e[0]}<audio id={e[1]} src={e[2]}></audio></div>
    })

  return (
    <div id='container'>
        <div className='row'>
            <div id='drum-machine' >
                <div id='title-box'>
                    <h1 id="title" className='text-glow'>Beatboi 2.0</h1>
                    <RowOption updateRow={updateRow1} labelName={'Row 1 '} optionMap={optionMap} />
                    <RowOption updateRow={updateRow2} labelName={'Row 2 '} optionMap={optionMap} />
                    <RowOption updateRow={updateRow3} labelName={'Row 3 '} optionMap={optionMap} />
                    <RowOption updateRow={updateRow4} labelName={'Row 4 '} optionMap={optionMap} />
                </div>
                <div id='drum-pads'>
                    {padKeys}
                </div>
                <div id='display-box'>
                    <div id='display'><p className='text-glow'>{displayText}</p></div>
                    <div id='bpm-div'>
                        <input id="bpm" className='text-glow' type="text" name='bpm' placeholder='100'></input>
                        <button id='btn-bpm' className='btn' onClick={enterBpm}>BPM</button>
                    </div>
                    <img id='play' onClick={(e)=> timer(e)} className='icon' src='play_pause.svg'></img>
                </div>
            </div>
            <div id='sequencer'>
                <div className='seq-row'>
                    {lightMap}
                </div>
                <SeqRow className='row row1' addClass={addClass} />
                <SeqRow className='row row2' addClass={addClass} />
                <SeqRow className='row row3' addClass={addClass} />
                <SeqRow className='row row4' addClass={addClass} />
            </div>
        </div>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))