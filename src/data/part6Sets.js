const buildPassageQuestions = (setId, passage, passageIndex, questions) => questions.map(([prompt, options, answer], index) => ({
  id: `${setId}-${passage.id}-q-${index + 1}`,
  type: 'text-completion',
  passageId: passage.id,
  passageTitle: passage.title,
  passage: passage.text,
  number: 131 + passageIndex * 4 + index,
  kind: index === passage.sentenceIndex ? 'sentence' : 'word',
  prompt,
  options,
  answer,
}))

const buildSet = (id, title, label, color, passages) => ({
  id,
  title,
  label,
  color,
  questions: passages.flatMap((passage, passageIndex) => buildPassageQuestions(id, passage, passageIndex, passage.questions)),
})

export const part6Sets = [
  buildSet('part6-set-1', 'Đề 01', 'Notice, e-mail & testimonial', 'coral', [
    {
      id: 'city-hall',
      title: 'Power Outage Scheduled at City Hall',
      sentenceIndex: 3,
      text: "On Friday, April 14, the city hall's electricity is scheduled to be shut down at 7 A.M. and restored at 6 P.M. The building ____ for the day. During the power outage, the emergency lighting system will be upgraded. ____, all circuit panels will be replaced to bring them into compliance with current safety codes.\n\n____ exiting city hall offices on Thursday, please disconnect all desktop computers, wireless servers, and other computer-related equipment. Furthermore, employees are asked to remove any personal contents from the kitchenette. ____. Please direct questions or concerns to the director of building maintenance.",
      questions: [
        ['The building _____ for the day.', ['has closed', 'closing', 'will close', 'was closing'], 2],
        ['_____, all circuit panels will be replaced to bring them into compliance with current safety codes.', ['In that case', 'Regularly', 'Rather than', 'Specifically'], 3],
        ['_____ exiting city hall offices on Thursday, please disconnect all desktop computers, wireless servers, and other computer-related equipment.', ['Inside', 'Beyond', 'Without', 'Before'], 3],
        ['Furthermore, employees are asked to remove any personal contents from the kitchenette. _____.', ['Any items left behind will be discarded.', 'The contents of each refrigerator must be labeled.', 'Employees should report to work as usual.', 'Emergency lighting will allow each department to remain operational.'], 0],
      ],
    },
    {
      id: 'network-alert',
      title: 'Network Alert',
      sentenceIndex: 3,
      text: 'To: All employees\nFrom: Cecil Radu, Information Technology Manager\nDate: April 8\nRe: Network alert\n\nWe are experiencing some problems with our local network. Some of the affected services include the _____ company Web site and the payroll database. We have also received information _____ network data becoming corrupted and files not saving properly. Therefore, to ensure that you do not lose any work, please avoid using the network this morning while my team addresses these _____. We anticipate that the systems will be fully functional by this afternoon. _____.',
      questions: [
        ['Some of the affected services include the _____ company Web site and the payroll database.', ['internalizing', 'internalize', 'internally', 'internal'], 3],
        ['We have also received information _____ network data becoming corrupted and files not saving properly.', ['as', 'in', 'about', 'with'], 2],
        ['Please avoid using the network this morning while my team addresses these _____.', ['issues', 'clients', 'articles', 'proposals'], 0],
        ['We anticipate that the systems will be fully functional by this afternoon. _____.', ['The network server will be expensive.', 'Your computer may be corrupted.', 'Thank you for your patience.', 'Contact the IT help desk.'], 2],
      ],
    },
    {
      id: 'voice-customer',
      title: 'Voice of the Customer',
      sentenceIndex: 3,
      text: 'For months, Yi Zhang, owner of Zhang Office Supplies, had been searching for a way to increase _____. Then, by sheer chance, he heard about an approach called Voice of the Customer (VOC).\n\n"When I called Hsing Market Research I was really intrigued as the method was presented to me. The representative I spoke with convinced me to give _____ a try." Mr. Zhang learned that VOC uses market research as an aid to designing targeted advertisements. Using the method, he first determined _____ what potential customers are concerned about and what they want when shopping for office supplies. Then he used candid quotes from the people who participated in his market research to create advertisements for his Web site. _____. "Thanks to VOC," he says, "my customer base has expanded like never before."',
      questions: [
        ['For months, Yi Zhang had been searching for a way to increase _____.', ['production', 'capacity', 'sales', 'wages'], 2],
        ['The representative I spoke with convinced me to give _____ a try.', ['anyone', 'it', 'mine', 'those'], 1],
        ['Using the method, he first determined _____ what potential customers are concerned about.', ['exactly', 'exact', 'exacting', 'exactness'], 0],
        ['Then he used candid quotes from the people who participated in his market research to create advertisements for his Web site. _____.', ['He has been in business for eleven years.', 'He also used them in direct e-mail campaigns.', 'He also owns a local supermarket.', 'He plans to move to a smaller building.'], 1],
      ],
    },
    {
      id: 'klok-handbook',
      title: 'Employee Handbook Update',
      sentenceIndex: 0,
      text: "Klok Financial has recently updated its employee handbook. _____. Although the information concerning benefits and terms of employment remains the same, other important modifications have been made. This version of the handbook includes new policies concerning e-mail privacy, Internet use, and use of mobile devices. Our travel guidelines have also been _____. The process for reimbursement after a trip is now much more efficient.\n\nAll employees must attend an informational session about the policies. One-hour sessions will be held at 10 A.M. on 9 July and 16 July. _____, employees will be required to sign a form acknowledging that they have received, read, and understood the information contained in the handbook and that they accept the terms. Please arrange with your manager _____ one of these sessions.",
      questions: [
        ['Klok Financial has recently updated its employee handbook. _____.', ['Thank you for adhering to the policies.', 'Our new logo is displayed on the cover.', 'This is the first change in over ten years.', 'Corporate lawyers were hired to write it.'], 2],
        ['Our travel guidelines have also been _____.', ['revised', 'deleted', 'discussed', 'notified'], 0],
        ['One-hour sessions will be held at 10 A.M. on 9 July and 16 July. _____, employees will be required to sign a form.', ['In summary', 'On the other hand', 'As a matter of fact', 'Immediately afterward'], 3],
        ['Please arrange with your manager _____ one of these sessions.', ['to attend', 'who attended', 'while attending', 'in attendance at'], 0],
      ],
    },
  ]),
  buildSet('part6-set-2', 'Đề 02', 'Notice, letter & announcement', 'mint', [
    {
      id: 'property-notice',
      title: 'Restroom Maintenance Notice',
      sentenceIndex: 3,
      text: 'NOTICE\n\nTo continue providing the highest level of _____ to our corporate tenants, we have scheduled the south lobby restrooms for maintenance this weekend, May 13 and May 14. _____ this time, the restrooms will be out of order, so tenants and their guests should instead use the facilities in the north lobby.\n\nWe _____ for any inconvenience this might cause. _____.\n\nDenville Property Management Partners',
      questions: [
        ['To continue providing the highest level of _____ to our corporate tenants...', ['serve', 'served', 'server', 'service'], 3],
        ['_____ this time, the restrooms will be out of order.', ['Along', 'During', 'Without', 'Between'], 1],
        ['We _____ for any inconvenience this might cause.', ['apologize', 'organize', 'realize', 'recognize'], 0],
        ['We apologize for any inconvenience this might cause. _____.', ['If you would like to join our property management team, call us today.', 'Thank you for your patience while the main lobby is being painted.', 'Please do not attempt to access the north lobby on these days.', 'Questions or comments may be directed to the Management Office.'], 3],
      ],
    },
    {
      id: 'mangubat-letter-2',
      title: 'Job Application',
      sentenceIndex: 1,
      text: "Dear Mr. Mangubat,\n\nI am writing to apply for the mechanical engineer position advertised on your Web site. I think I have much to offer Farsten Products' design ____ as an employee. _____. I am currently an engineer at Yount Systems, where I have worked on machine and engine designs for the last six years. _____ that, I was employed by Zelenka Industries, where I helped develop efficient methods for recycling scrap steel.\n\nI have enclosed my resume, which _____ more details about my work history and my educational background. I look forward to meeting with you to discuss how my skills and experience can benefit Farsten Products.",
      questions: [
        ["I think I have much to offer Farsten Products' design _____ as an employee.", ['phase', 'department', 'consultant', 'expertise'], 1],
        ['_____. I am currently an engineer at Yount Systems, where I have worked on machine and engine designs for the last six years.', ['Your Web site also listed an internship that would be a great opportunity.', 'The job description said that applicants should have an advanced degree.', 'My manager replied to your request last week.', 'My extensive experience makes me an ideal fit for your company.'], 3],
        ['_____ that, I was employed by Zelenka Industries, where I helped develop efficient methods for recycling scrap steel.', ['Regarding', 'Following', 'Contrary to', 'Prior to'], 3],
        ['I have enclosed my resume, which _____ more details about my work history and my educational background.', ['give', 'gave', 'gives', 'is giving'], 2],
      ],
    },
    {
      id: 'briggs-maintenance',
      title: 'Road Maintenance Notice',
      sentenceIndex: 1,
      text: 'July 2\n\nDear Mr. Arakaki:\n\nI am writing to inform you of scheduled road maintenance on Briggs Avenue. Beginning on July 15, Briggs Avenue _____ reduced to one lane from Elm Street to Bay Road. _____. Although your _____ is not located in this section of Briggs Avenue, traffic on most of the street will move more slowly than usual while work is being performed. You may _____ consider advising your employees to take alternate routes to work during this time. The project is expected to be completed on or before October 2. Thank you for your cooperation and assistance.',
      questions: [
        ['Beginning on July 15, Briggs Avenue _____ reduced to one lane from Elm Street to Bay Road.', ['was', 'will be', 'can be', 'has been'], 1],
        ['Briggs Avenue will be reduced to one lane from Elm Street to Bay Road. _____.', ['Briggs Avenue is only two miles away.', 'The event will take place on Elm Street.', 'Please refer to the enclosed map of the affected area.', 'However, all city services will close during this time.'], 2],
        ['Although your _____ is not located in this section of Briggs Avenue...', ['mailbox', 'school', 'signage', 'business'], 3],
        ['You may _____ consider advising your employees to take alternate routes to work.', ['fortunately', 'instead', 'likewise', 'therefore'], 3],
      ],
    },
    {
      id: 'healthonity-dental',
      title: 'Dental Center Introduction',
      sentenceIndex: 1,
      text: 'Dear Ms. Aiyar,\n\nWe, the dental health professionals of the Healthonity Dental Center, are _____ to introduce our just-opened practice. We aim to provide access to the largest team of dental specialists in the region. On our Web site, you can see a comprehensive list of the procedures we offer. _____. The members of our practice share a passion for helping people maintain beautiful and healthy smiles.\n\nContact our center today at 305-555-0121 _____ an initial evaluation. All first-time _____ will benefit from a 50 percent discount on the cost through the end of the month.\n\nSincerely,\nThe Team at Healthonity Dental Center',
      questions: [
        ['We, the dental health professionals of the Healthonity Dental Center, are _____ to introduce our just-opened practice.', ['prouder', 'proudly', 'pride', 'proud'], 3],
        ['On our Web site, you can see a comprehensive list of the procedures we offer. _____.', ['They include general and cosmetic procedures.', 'We have relocated from neighboring Hillsborough.', 'The Web site is a creation of A to Z Host Builders.', 'Several of them are surprisingly expensive.'], 0],
        ['Contact our center today at 305-555-0121 _____ an initial evaluation.', ['scheduled', 'to schedule', 'scheduling', 'being scheduled'], 1],
        ['All first-time _____ will benefit from a 50 percent discount on the cost.', ['shoppers', 'residents', 'patients', 'tenants'], 2],
      ],
    },
  ]),
  buildSet('part6-set-3', 'Đề 03', 'E-mail, announcement & memo', 'blue', [
    {
      id: 'dellwyn-order',
      title: 'Order Update',
      sentenceIndex: 3,
      text: 'To: Myung-Hee Hahn\nFrom: Dellwyn Home Store\nDate: January 15\nSubject: Order update\n\nDear Ms. Hahn,\n\nYour _____ order of a red oak dining table and six matching chairs arrived at our store this morning. We would now like to arrange for the delivery of the _____. Please call us at 517-555-0188 and ask _____ to Coleman Cobb, our delivery manager. _____.\n\nCustomer Service, Dellwyn Home Store',
      questions: [
        ['Your _____ order of a red oak dining table and six matching chairs arrived at our store this morning.', ['specially', 'specialize', 'special', 'specializing'], 2],
        ['We would now like to arrange for the delivery of the _____.', ['furniture', 'appliances', 'refund', 'tools'], 0],
        ['Please call us at 517-555-0188 and ask _____ to Coleman Cobb, our delivery manager.', ['speak', 'spoken', 'is speaking', 'to speak'], 3],
        ['Please call us at 517-555-0188 and ask to speak to Coleman Cobb, our delivery manager. _____.', ['He can schedule a convenient time.', 'He began working here yesterday.', 'He can meet you at 11:00 A.M.', 'He recently moved to Dellwyn.'], 0],
      ],
    },
    {
      id: 'lybera-announcement',
      title: 'New Board Chairperson',
      sentenceIndex: 3,
      text: '(May 2)—Automotive-manufacturing company Lybera, Inc., today announced that Harvey Ramirez has been appointed as the new chairperson of its board of directors. He _____ Helen McGavick, who has resigned in order to pursue a new business venture.\n\n“We thank Ms. McGavick for her service and wish her success in her _____ endeavors,” said Fen Wang, Lybera’s president and CEO.\n\nMr. Ramirez has spent ten years as CEO of aerospace-engineering firm Elia Aviation. _____, he held a variety of senior management roles across public and private sectors.\n\n“Mr. Ramirez’s familiarity with sophisticated technology, combined with his leadership experience, makes him well suited to lead our company,” said Mr. Wang. “_____.”',
      questions: [
        ['He _____ Helen McGavick, who has resigned in order to pursue a new business venture.', ['replaces', 'was replacing', 'has been replaced', 'would have replaced'], 0],
        ['We wish her success in her _____ endeavors.', ['advancing', 'future', 'certain', 'instant'], 1],
        ['Mr. Ramirez has spent ten years as CEO of Elia Aviation. _____, he held a variety of senior management roles.', ['Again', 'Consequently', 'Previously', 'However'], 2],
        ['“Mr. Ramirez’s familiarity with sophisticated technology... makes him well suited to lead our company,” said Mr. Wang. “_____.”', ['These meetings take place on a regular basis.', 'The product is currently being developed.', 'We hope to learn more about the position.', 'We look forward to his guidance.'], 3],
      ],
    },
    {
      id: 'jwf-memo',
      title: 'New Budget Director',
      sentenceIndex: 0,
      text: "To the JWF team and our community partners:\n\n_____. I just want to let you know that Sofia Vargas _____ as the Jansen-Webb Foundation’s new budget director. Ms. Vargas has a strong background in fiscal _____ within the nonprofit sector.\n\nMs. Vargas brings with her a wealth of experience in organizational finance, including most recently at The Lawton Children’s Centre in Winnipeg. Ms. Vargas started her employment with us this morning, so please stop in and introduce _____ to her.\n\nBest,\nHong Truong\nCEO, Jansen-Webb Foundation",
      questions: [
        ['_____ I just want to let you know that Sofia Vargas has been hired as the foundation’s new budget director.', ['This is a request to be prompt.', 'Thanks for the generous contribution.', 'All are welcome here.', 'I hope that all are well.'], 3],
        ['I just want to let you know that Sofia Vargas _____ as the Jansen-Webb Foundation’s new budget director.', ['is hiring', 'will be hired', 'has been hired', 'is being hired'], 2],
        ['Ms. Vargas has a strong background in fiscal _____ within the nonprofit sector.', ['referral', 'administrator', 'running', 'management'], 3],
        ['Please stop in and introduce _____ to her.', ['yourself', 'him', 'them', 'ourselves'], 0],
      ],
    },
    {
      id: 'jewelry-email',
      title: 'Jewelry Shipment',
      sentenceIndex: 1,
      text: 'To: Jang-Ho Kwon <jkwon@newart.nz>\nFrom: Kenneth Okim <k.okim@okimjewelry.nz>\nSubject: Good news\nDate: 30 August\n\nDear Jang-Ho,\n\nThank you for the shipment last month of 80 units of your jewelry pieces. I am happy to report that they have been selling very well in my shop. My _____ love the colourful designs as well as the quality of your workmanship. _____.\n\nI would like to increase the number of units I order from you. Would you be able to _____ my order for the September shipment?\n\nFinally, I would like to discuss the possibility of featuring your work exclusively in my store. I believe that I could reach your target audience best and that the agreement would serve _____ both very well. I look forward to hearing from you.\n\nBest regards',
      questions: [
        ['My _____ love the colourful designs as well as the quality of your workmanship.', ['patients', 'students', 'customers', 'teammates'], 2],
        ['My customers love the colourful designs as well as the quality of your workmanship. _____.', ['If you need more time, please let me know.', 'Unfortunately, I do not have adequate shelf space at this time.', 'I would like to show you some of my own designs.', 'The reasonable prices also make your pieces a great value.'], 3],
        ['Would you be able to _____ my order for the September shipment?', ['include', 'double', 'repeat', 'insure'], 1],
        ['The agreement would serve _____ both very well.', ['us', 'you', 'we', 'these'], 0],
      ],
    },
  ]),
]
