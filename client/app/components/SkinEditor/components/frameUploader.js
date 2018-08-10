import React from 'react'
import {Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody} from 'react-accessible-accordion'

const FrameUploader = (props) => (<Accordion accordion={false}>
  {
    props.data_names.map((name, idx) => {
      return (<AccordionItem key={idx}>
        <AccordionItemTitle>
          <h3 className="u-position-relative">
            {name}
            <div className="accordion__arrow" role="presentation"/>
          </h3>
        </AccordionItemTitle>
        <AccordionItemBody>
          <div className="upload-side col-md-8">
            {
              props.data[idx].image.length >= 1
                ? (<div>
                  {
                    props.data[idx].image.map((image, idx) => {
                      return (<div key={idx} className="frameHolder">
                        <div className="edit-frame-button-wrapper">
                          <img src={image.data} />
                          <button className="button button-caution button-circle">
                            <i className="far fa-trash-alt"></i>
                          </button>
                          <button className="button button-primary  button-circle">
                            <i className="fas fa-exchange-alt"></i>
                          </button>
                          <button className="button button-highlight button-circle">
                            <i className="fas fa-edit"></i>
                          </button>
                        </div>
                      </div>)
                    })
                  }
                </div>)
                : (<div></div>)
            }
            <div className="new-frame-button-wrapper">
              <button id="new-frame-button" className="button button-action button-circle">
                <i className="fa fa-plus"></i>
              </button>
              <input className="new-frame-input" id={idx} key={idx} onChange={props.change} name="Select File" type="file"/>
            </div>
            <div className="clear"></div>
          </div>
          <div className="preview-side col-md-4"></div>
        </AccordionItemBody>
      </AccordionItem>)
    })
  }
</Accordion>)

export default FrameUploader
