import axios from 'axios';
import { API_URL } from './config';
import { data } from './data';

let surveyId;
let sectionId;
let subSectionId;
let questionId;
let choiceId;
let surveySectionId;

let surveyData;
let sectionData;
let subSectionData;
let questionData;
let choiceData;

const populateDB = () => {
  try {
    console.log('starting ....');
    // const payload = data;
    surveyData = {
      title: data.title,
      description: data.description,
      year: data.year,
      valid: data.valid,
    };

    axios
      .request({
        method: 'POST',
        data: surveyData,
        url: `${API_URL}/surveys`,
      })
      .then((response) => {
        surveyId = response.data.data.id;
        console.log('survey id>>>>>>>>>>>>>>>>>>>>>>', surveyId);
        data.sections.forEach((section) => {
          sectionData = {
            title: section.title,
            position: section.position,
            survey: surveyId,
            canSkip: section.canSkip,
          };
          axios
            .request({
              method: 'POST',
              data: sectionData,
              url: `${API_URL}/sections`,
            })
            .then((sectionResponse) => {
              console.log(
                'sectionId>>>>>>>>>>>>>>>>>>>>>>>',
                sectionResponse.data.data.id
              );
              sectionId = sectionResponse.data.data.id;
              surveySectionId = sectionResponse.data.data.id;
              console.log('Section >>>>>>>>>>>>>>>>>>>', sectionId);
              section.subSections.forEach((subSection) => {
                subSectionData = {
                  title: subSection.title,
                  position: subSection.position,
                  section: sectionId,
                };
                axios
                  .request({
                    method: 'POST',
                    data: subSectionData,
                    url: `${API_URL}/sub-sections`,
                  })
                  .then((response) => {
                    console.log(response);
                    subSectionId = response.data.data.id;
                    console.log('SubSection >>>>>>>>>>>>>>>>>>>', subSectionId);
                    subSection.questions.forEach((question) => {
                      questionData = {
                        text: question.text,
                        type: question.type,
                        htmlElement: question.htmlElement,
                        inputIcon: question.inputIcon,
                        answerDataType: question.answerDataType,
                        canSkip: question.canSkip,
                        graded: question.graded,
                        position: question.position,
                        maximumScore: question.maximumScore,
                        surveyId: surveyId,
                        subSectionId: subSectionId,
                        sectionId: sectionResponse.data.data.id,
                      };
                      axios
                        .request({
                          method: 'POST',
                          data: questionData,
                          url: `${API_URL}/questions`,
                        })
                        .then((response) => {
                          console.log(response);
                          questionId = response.data.data.id;
                          console.log(
                            'Question >>>>>>>>>>>>>>>>>>>',
                            questionId
                          );

                          /**
                           * Check if choices exist and also create choices
                           */
                          if (
                            question.type === 'MULTIPLE_CHOICE' &&
                            question.choices
                          ) {
                            question.choices.forEach((choice) => {
                              choiceData = {
                                text: choice.text,
                                score: choice.score,
                                questionId: questionId,
                              };
                              axios
                                .request({
                                  method: 'POST',
                                  data: choiceData,
                                  url: `${API_URL}/choices`,
                                })
                                .then((response) => {
                                  console.log(response);
                                })
                                .catch((error) =>
                                  console.log(
                                    'Error caught ()',
                                    error.response.data
                                  )
                                );
                            });
                          }
                        })
                        .catch((error) =>
                          console.log('Error caught ()', error)
                        );
                    });
                  })
                  .catch((error) => console.log('Error caught ()', error));
              });
            })
            .catch((error) => console.log('Error caught ()', error));
        });
      })
      .catch((error) => console.log('Error caught ()', error));
    console.log('ending ....');
  } catch (error) {
    console.error('Error caught ()', error);
  }
};

populateDB();
