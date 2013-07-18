<?php

class User_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
	}

	public function getAll(){
		return $this->get(array());
	}

	public function getNearLocation($lat, $lng, $d) {

		// m to km
		$d = $d / 1000;

		$sql = " select result.cityId, city, user.userId, user.userName, result.distance, latitude, longitude FROM ( select latitude, longitude, cityId, city, ( 6371 * acos( cos( radians(".$lat.") ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(".$lng.") ) + sin( radians(".$lat.") ) * sin( radians( latitude ) ) ) ) AS distance FROM city_location HAVING distance <= ".$d." ORDER BY distance ) AS result INNER JOIN user ON user.cityId=result.cityId";

		$q = $this->db->query($sql);

		if(!$q || !$q->num_rows())
			return array();

		else
			return $q->result_array();
	}

	private function get($rest)
	{
		$this->db->select("*");
		$this->db->from("user");
		$this->db->join("city_location", "user.cityId = city_location.cityId");
		$this->db->where($rest);

		$q = $this->db->get();

		if(!$q || !$q->num_rows())
			return array();

		else
			return $q->result_array();
	}
}
