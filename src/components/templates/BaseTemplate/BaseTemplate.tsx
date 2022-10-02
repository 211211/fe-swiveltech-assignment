import { BaseTemplateContainer } from './BaseTemplate.styles';

export interface BaseTemplateProps {
  children: string;
}

const BaseTemplate: React.FC<BaseTemplateProps> = ({ children }) => {
  return <BaseTemplateContainer>{children}</BaseTemplateContainer>;
};

export default BaseTemplate;
