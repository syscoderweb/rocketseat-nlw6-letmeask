import logoImg from '../assets/images/logo.svg';
import {Button} from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import {useHistory, useParams} from 'react-router-dom'
import Question from '../components/Question';
import {useRoom} from '../hooks/useRoom';

import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import '../styles/room.scss';
import { database } from '../services/firebase';

type RoomParamsProps = {
    id: string;
}


export function AdminRoom(){
    const history = useHistory();
    const params = useParams<RoomParamsProps>();
    const roomId = params.id;

    const {questions, title} = useRoom(roomId);

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update(
            {
                endedAt: new Date()
            }
        );
        
        history.push("/");
    }

    async function handleCheckQuestionAsAnswered(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });
    }

    async function handleHighlightQuestion(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
    }

    async function handleDeleteQuestion(questionId:string){
        if (window.confirm("Tem certeza que deseja excluir essa pergunta?")){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={params.id} />
                        <Button isOutlined onClick={()=>handleEndRoom()}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
               

                {/* {JSON.stringify(questions)} */}


                <div className="question-list">
                    {
                        questions.map(question =>{
                            return(
                                <Question
                                    key={question.id}
                                    content={question.content}
                                    author={question.author}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    {
                                        !question.isAnswered && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={()=>handleCheckQuestionAsAnswered(question.id)}
                                                >
                                                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={()=>handleHighlightQuestion(question.id)}
                                                >
                                                    <img src={answerImg} alt="Dar destaque à pergunta" />
                                                </button>
                                            </>
                                        )
                                    }
                                    <button
                                        type="button"
                                        onClick={()=>handleDeleteQuestion(question.id)}
                                    >
                                        <img src={deleteImg} alt="Deletar Pergunta" />
                                    </button>
                                </Question>
                            )
                        })
                    }
                </div>
                
            </main>
        </div>
    )
}