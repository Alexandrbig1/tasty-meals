import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

function setLimitMeals() {
  let limit = 0;
  if (window.innerWidth < 768) {
    limit = 6;
    return limit;
  } else if (window.innerWidth < 1280) {
    limit = 8;
    return limit;
  } else {
    limit = 9;
    return limit;
  }
}
